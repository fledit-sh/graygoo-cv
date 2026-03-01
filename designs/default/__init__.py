from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from designs.base import DesignPlugin, RendererFactory


@dataclass(slots=True)
class JsonRendererFactory(RendererFactory):
    """Minimal renderer factory placeholder for default design."""

    renderer_name: str

    def create_renderer(self, target: str) -> dict[str, str]:
        return {"renderer": self.renderer_name, "target": target}


@dataclass(slots=True)
class DefaultDesignPlugin(DesignPlugin):
    @property
    def plugin_id(self) -> str:
        return "default"

    @property
    def version(self) -> str:
        return "1.0.0"

    @property
    def token_set(self) -> dict[str, Any]:
        return {
            "color.text.primary": "#111111",
            "color.text.muted": "#555555",
            "space.section": "1.5rem",
            "typography.heading": "Inter",
        }

    @property
    def renderer_mappings(self) -> dict[str, RendererFactory]:
        return {
            "json": JsonRendererFactory(renderer_name="default-json"),
            "html": JsonRendererFactory(renderer_name="default-html"),
        }

    @property
    def compatible_design_ids(self) -> set[str]:
        return {"default", "legacy-default"}


PLUGIN = DefaultDesignPlugin()
