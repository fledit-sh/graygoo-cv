from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from designs.base import DesignPlugin, RendererFactory
from designs.default import JsonRendererFactory


@dataclass(slots=True)
class HighContrastDesignPlugin(DesignPlugin):
    @property
    def plugin_id(self) -> str:
        return "high-contrast"

    @property
    def version(self) -> str:
        return "1.0.0"

    @property
    def token_set(self) -> dict[str, Any]:
        return {
            "text": {
                "heading": {
                    "primary": {"font_family": "Atkinson Hyperlegible", "font_size": "1.5rem", "color": "#000000"},
                    "secondary": {"font_family": "Atkinson Hyperlegible", "font_size": "1.25rem", "color": "#111111"},
                },
                "body": {
                    "primary": {"font_family": "Atkinson Hyperlegible", "font_size": "1rem", "color": "#000000"},
                    "muted": {"font_family": "Atkinson Hyperlegible", "font_size": "1rem", "color": "#222222"},
                },
            },
            "surface": {
                "panel": "#ffffff",
                "background": "#fefefe",
            },
            "spacing": {
                "sm": "0.5rem",
                "md": "1rem",
                "section": "1.75rem",
            },
        }

    @property
    def renderer_mappings(self) -> dict[str, RendererFactory]:
        return {
            "json": JsonRendererFactory(renderer_name="high-contrast-json"),
            "html": JsonRendererFactory(renderer_name="high-contrast-html"),
        }


PLUGIN = HighContrastDesignPlugin()
