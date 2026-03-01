# Design Plugin Guide

This editor supports **design plugins** discovered from:

- built-in packages under `designs/`
- user-installed packages listed in app settings (`external_design_package_paths`)

## Compatibility requirements

Every design plugin must provide:

1. A Python package with `__init__.py` exposing `PLUGIN` (or `get_plugin()`).
2. A `design.json` manifest in the same folder.
3. Matching `design_api_version` in both the plugin and manifest.

Plugins are loaded only when all compatibility checks pass:

- `design_api_version` matches the editor-supported version (`1`)
- `required_editor_version` in `design.json` is less than or equal to current editor version
- `plugin_id` / `version` in `design.json` match the plugin object

## Minimal plugin template

Create a package folder, for example `my_design/`:

```text
my_design/
  __init__.py
  design.json
```

### `__init__.py`

```python
from dataclasses import dataclass
from typing import Any

from designs.base import DesignPlugin
from designs.default import JsonRendererFactory


@dataclass(slots=True)
class MyDesignPlugin(DesignPlugin):
    @property
    def plugin_id(self) -> str:
        return "my-design"

    @property
    def version(self) -> str:
        return "1.0.0"

    @property
    def design_api_version(self) -> str:
        return "1"

    @property
    def token_set(self) -> dict[str, Any]:
        return {
            "text": {
                "heading": {
                    "primary": {"font_family": "Inter", "font_size": "1.5rem", "color": "#111111"},
                    "secondary": {"font_family": "Inter", "font_size": "1.25rem", "color": "#333333"},
                },
                "body": {
                    "primary": {"font_family": "Inter", "font_size": "1rem", "color": "#222222"},
                    "muted": {"font_family": "Inter", "font_size": "1rem", "color": "#666666"},
                },
            },
            "surface": {"panel": "#f6f6f6", "background": "#ffffff"},
            "spacing": {"sm": "0.5rem", "md": "1rem", "section": "1.5rem"},
        }

    @property
    def renderer_mappings(self):
        return {
            "json": JsonRendererFactory(renderer_name="my-design-json"),
            "html": JsonRendererFactory(renderer_name="my-design-html"),
        }


PLUGIN = MyDesignPlugin()
```

### `design.json`

```json
{
  "plugin_id": "my-design",
  "name": "My Design",
  "description": "Custom user-installed design package.",
  "version": "1.0.0",
  "design_api_version": "1",
  "required_editor_version": "1.0.0",
  "preview": "preview/my-design.png"
}
```

## Registering user-installed designs

Add package paths to settings JSON:

```json
{
  "external_design_package_paths": [
    "/absolute/path/to/my_design"
  ]
}
```

Then call `load_controller(..., settings_path="/path/to/settings.json")` to include external designs at startup.
