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
            "text": {
                "heading": {
                    "primary": {"font_family": "Inter", "font_size": "1.5rem", "color": "#111111"},
                    "secondary": {"font_family": "Inter", "font_size": "1.25rem", "color": "#222222"},
                },
                "body": {
                    "primary": {"font_family": "Inter", "font_size": "1rem", "color": "#222222"},
                    "muted": {"font_family": "Inter", "font_size": "1rem", "color": "#555555"},
                },
            },
            "surface": {
                "panel": "#f5f5f5",
                "background": "#ffffff",
            },
            "spacing": {
                "sm": "0.5rem",
                "md": "1rem",
                "section": "1.5rem",
            },
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
