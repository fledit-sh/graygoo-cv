from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from importlib import import_module
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


@dataclass(slots=True)
class DesignRegistry:
    """Discovery/lookup for plugins in designs/<name>/ packages."""

    default_plugin_id: str = "default"
    _plugins_by_id: dict[str, DesignPlugin] = field(default_factory=dict, init=False)
    _plugins_by_compat_id: dict[str, DesignPlugin] = field(default_factory=dict, init=False)

    def load_plugins(self) -> None:
        """Import plugins from immediate subpackages in designs/."""

        designs_dir = Path(__file__).resolve().parent
        for child in designs_dir.iterdir():
            if not child.is_dir() or child.name.startswith("_"):
                continue

            module_name = f"designs.{child.name}"
            try:
                module = import_module(module_name)
            except Exception:
                # Best-effort loading; invalid plugin modules are ignored.
                continue

            plugin = self._extract_plugin(module)
            if plugin is None:
                continue

            self._plugins_by_id[plugin.plugin_id] = plugin
            for compatible_id in plugin.compatible_design_ids:
                self._plugins_by_compat_id[compatible_id] = plugin

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


def _parse_version(version: str) -> tuple[int, ...]:
    parsed: list[int] = []
    for chunk in version.split("."):
        number = "".join(ch for ch in chunk if ch.isdigit())
        if number:
            parsed.append(int(number))
        else:
            parsed.append(0)
    return tuple(parsed)
