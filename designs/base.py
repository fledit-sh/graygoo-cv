from __future__ import annotations

import json
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from importlib import import_module
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from typing import Any, Protocol


class TokenProvider(Protocol):
    """Exposes design tokens for a plugin."""

    def get_tokens(self) -> dict[str, Any]:
        """Return a mapping of semantic tokens for the design."""


class RendererFactory(Protocol):
    """Builds renderers for named targets (for example html/pdf)."""

    def create_renderer(self, target: str) -> Any:
        """Create a renderer instance for a target."""


class DesignPlugin(ABC):
    """Base interface for design plugins."""

    @property
    @abstractmethod
    def plugin_id(self) -> str:
        """Stable identifier for the plugin."""

    @property
    @abstractmethod
    def version(self) -> str:
        """Version string in semantic format."""

    @property
    @abstractmethod
    def design_api_version(self) -> str:
        """Plugin API contract version implemented by this plugin."""

    @property
    @abstractmethod
    def token_set(self) -> dict[str, Any]:
        """Semantic design token set for the plugin."""

    @property
    @abstractmethod
    def renderer_mappings(self) -> dict[str, RendererFactory]:
        """Renderer factories keyed by target."""

    @property
    def compatible_design_ids(self) -> set[str]:
        """Optional aliases for legacy IDs."""

        return {self.plugin_id}

    def is_compatible_id(self, design_id: str) -> bool:
        return design_id in self.compatible_design_ids


@dataclass(frozen=True, slots=True)
class DesignManifest:
    plugin_id: str
    version: str
    design_api_version: str
    required_editor_version: str
    name: str | None = None
    description: str | None = None
    preview: str | None = None


@dataclass(slots=True)
class DesignRegistry:
    """Discovery/lookup for plugins in designs/<name>/ packages."""

    default_plugin_id: str = "default"
    supported_design_api_version: str = "1"
    editor_version: str = "1.0.0"
    external_design_package_paths: tuple[str, ...] = ()
    _plugins_by_id: dict[str, DesignPlugin] = field(default_factory=dict, init=False)
    _plugins_by_compat_id: dict[str, DesignPlugin] = field(default_factory=dict, init=False)
    _active_plugin_id: str = field(default="", init=False)

    def load_plugins(self) -> None:
        """Import plugins from built-in and external packages."""

        self._plugins_by_id.clear()
        self._plugins_by_compat_id.clear()

        for module_name, package_dir in self._iter_builtin_plugins():
            module = self._safe_import_builtin(module_name)
            if module is not None:
                self._register_plugin(module=module, package_dir=package_dir)

        for package_dir in self._iter_external_packages():
            module = self._safe_import_external(package_dir)
            if module is not None:
                self._register_plugin(module=module, package_dir=package_dir)

    def _iter_builtin_plugins(self) -> list[tuple[str, Path]]:
        designs_dir = Path(__file__).resolve().parent
        candidates: list[tuple[str, Path]] = []
        for child in designs_dir.iterdir():
            if not child.is_dir() or child.name.startswith("_"):
                continue
            candidates.append((f"designs.{child.name}", child))
        return candidates

    def _iter_external_packages(self) -> list[Path]:
        package_dirs: list[Path] = []
        for raw_path in self.external_design_package_paths:
            package_dir = Path(raw_path).expanduser().resolve()
            if package_dir.is_dir():
                package_dirs.append(package_dir)
        return package_dirs

    def _safe_import_builtin(self, module_name: str) -> Any | None:
        try:
            return import_module(module_name)
        except Exception:
            return None

    def _safe_import_external(self, package_dir: Path) -> Any | None:
        module_entrypoint = package_dir / "__init__.py"
        if not module_entrypoint.exists():
            return None

        module_name = f"external_designs.{package_dir.name}"
        spec = spec_from_file_location(module_name, module_entrypoint)
        if spec is None or spec.loader is None:
            return None

        module = module_from_spec(spec)
        try:
            spec.loader.exec_module(module)
        except Exception:
            return None
        return module

    def _register_plugin(self, module: Any, package_dir: Path) -> None:
        plugin = self._extract_plugin(module)
        if plugin is None:
            return

        manifest = self._read_manifest(package_dir)
        if manifest is None:
            return

        if not self._is_plugin_compatible(plugin=plugin, manifest=manifest):
            return

        self._plugins_by_id[plugin.plugin_id] = plugin
        for compatible_id in plugin.compatible_design_ids:
            self._plugins_by_compat_id[compatible_id] = plugin

    def _read_manifest(self, package_dir: Path) -> DesignManifest | None:
        manifest_path = package_dir / "design.json"
        if not manifest_path.exists():
            return None

        try:
            payload = json.loads(manifest_path.read_text(encoding="utf-8"))
        except Exception:
            return None

        if not isinstance(payload, dict):
            return None

        plugin_id = payload.get("plugin_id")
        version = payload.get("version")
        design_api_version = payload.get("design_api_version")
        required_editor_version = payload.get("required_editor_version")

        if not all(isinstance(value, str) and value for value in (plugin_id, version, design_api_version, required_editor_version)):
            return None

        name = payload.get("name") if isinstance(payload.get("name"), str) else None
        description = payload.get("description") if isinstance(payload.get("description"), str) else None
        preview = payload.get("preview") if isinstance(payload.get("preview"), str) else None

        return DesignManifest(
            plugin_id=plugin_id,
            version=version,
            design_api_version=design_api_version,
            required_editor_version=required_editor_version,
            name=name,
            description=description,
            preview=preview,
        )

    def _is_plugin_compatible(self, plugin: DesignPlugin, manifest: DesignManifest) -> bool:
        if plugin.plugin_id != manifest.plugin_id:
            return False

        if plugin.version != manifest.version:
            return False

        if plugin.design_api_version != manifest.design_api_version:
            return False

        if plugin.design_api_version != self.supported_design_api_version:
            return False

        if _is_newer(manifest.required_editor_version, self.editor_version):
            return False

        return True

    def _extract_plugin(self, module: Any) -> DesignPlugin | None:
        plugin = getattr(module, "PLUGIN", None)
        if isinstance(plugin, DesignPlugin):
            return plugin

        factory = getattr(module, "get_plugin", None)
        if callable(factory):
            candidate = factory()
            if isinstance(candidate, DesignPlugin):
                return candidate

        return None

    def get(self, design_id: str | None) -> DesignPlugin:
        """Resolve plugin by ID with compatibility fallbacks."""

        if not self._plugins_by_id:
            self.load_plugins()

        if not design_id:
            return self.default_plugin

        normalized_id, requested_version = _split_design_ref(design_id)
        plugin = self._plugins_by_compat_id.get(normalized_id)
        if plugin is None:
            return self.default_plugin

        if requested_version and _is_older(requested_version, plugin.version):
            # Requested design points to an older version we no longer support.
            return self.default_plugin

        return plugin

    def activate(self, design_id: str | None) -> DesignPlugin:
        """Resolve and store the active plugin for UI shells."""

        plugin = self.get(design_id)
        self._active_plugin_id = plugin.plugin_id
        return plugin

    @property
    def active_plugin(self) -> DesignPlugin:
        if self._active_plugin_id:
            return self.get(self._active_plugin_id)
        return self.default_plugin

    def available_design_ids(self) -> tuple[str, ...]:
        if not self._plugins_by_id:
            self.load_plugins()
        return tuple(sorted(self._plugins_by_id.keys()))

    @property
    def default_plugin(self) -> DesignPlugin:
        if not self._plugins_by_id:
            self.load_plugins()

        plugin = self._plugins_by_id.get(self.default_plugin_id)
        if plugin is None:
            raise LookupError(f"Default design plugin '{self.default_plugin_id}' is not available")
        return plugin


def _split_design_ref(design_id: str) -> tuple[str, str | None]:
    if "@" not in design_id:
        return design_id, None

    base_id, _, version = design_id.partition("@")
    return base_id, version or None


def _is_older(requested: str, current: str) -> bool:
    return _parse_version(requested) < _parse_version(current)


def _is_newer(required: str, current: str) -> bool:
    return _parse_version(required) > _parse_version(current)


def _parse_version(version: str) -> tuple[int, ...]:
    parsed: list[int] = []
    for chunk in version.split("."):
        number = "".join(ch for ch in chunk if ch.isdigit())
        if number:
            parsed.append(int(number))
        else:
            parsed.append(0)
    return tuple(parsed)
