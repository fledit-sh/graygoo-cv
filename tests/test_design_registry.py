from __future__ import annotations

import tempfile
import textwrap
import unittest
from pathlib import Path

from designs.base import DesignRegistry


class DesignRegistryTests(unittest.TestCase):
    def test_loads_default_plugin_from_designs_folder(self) -> None:
        registry = DesignRegistry(default_plugin_id="default")

        plugin = registry.get("default")

        self.assertEqual(plugin.plugin_id, "default")
        self.assertEqual(plugin.version, "1.0.0")
        self.assertEqual(plugin.design_api_version, "1")
        self.assertIn("json", plugin.renderer_mappings)
        self.assertIn("text", plugin.token_set)
        self.assertIn("heading", plugin.token_set["text"])

    def test_unknown_plugin_falls_back_to_default(self) -> None:
        registry = DesignRegistry(default_plugin_id="default")

        plugin = registry.get("unknown-design")

        self.assertEqual(plugin.plugin_id, "default")

    def test_old_version_reference_falls_back_to_default(self) -> None:
        registry = DesignRegistry(default_plugin_id="default")

        plugin = registry.get("default@0.1.0")

        self.assertEqual(plugin.plugin_id, "default")

    def test_legacy_alias_maps_to_default_plugin(self) -> None:
        registry = DesignRegistry(default_plugin_id="default")

        plugin = registry.get("legacy-default")

        self.assertEqual(plugin.plugin_id, "default")

    def test_external_design_package_is_loaded_when_configured(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            package_dir = Path(temp_dir) / "custom_external"
            package_dir.mkdir(parents=True)
            (package_dir / "__init__.py").write_text(
                textwrap.dedent(
                    """
                    from dataclasses import dataclass
                    from designs.base import DesignPlugin
                    from designs.default import JsonRendererFactory


                    @dataclass(slots=True)
                    class ExternalPlugin(DesignPlugin):
                        @property
                        def plugin_id(self) -> str:
                            return "external-design"

                        @property
                        def version(self) -> str:
                            return "1.0.0"

                        @property
                        def design_api_version(self) -> str:
                            return "1"

                        @property
                        def token_set(self):
                            return {
                                "text": {
                                    "heading": {
                                        "primary": {"font_family": "Inter", "font_size": "1.5rem", "color": "#111"},
                                        "secondary": {"font_family": "Inter", "font_size": "1.25rem", "color": "#222"}
                                    },
                                    "body": {
                                        "primary": {"font_family": "Inter", "font_size": "1rem", "color": "#111"},
                                        "muted": {"font_family": "Inter", "font_size": "1rem", "color": "#333"}
                                    }
                                },
                                "surface": {"panel": "#fff", "background": "#fefefe"},
                                "spacing": {"sm": "0.5rem", "md": "1rem", "section": "1.5rem"}
                            }

                        @property
                        def renderer_mappings(self):
                            return {
                                "json": JsonRendererFactory(renderer_name="external-json"),
                                "html": JsonRendererFactory(renderer_name="external-html"),
                            }


                    PLUGIN = ExternalPlugin()
                    """
                ).strip()
                + "\n",
                encoding="utf-8",
            )
            (package_dir / "design.json").write_text(
                textwrap.dedent(
                    """
                    {
                      "plugin_id": "external-design",
                      "name": "External Design",
                      "version": "1.0.0",
                      "design_api_version": "1",
                      "required_editor_version": "1.0.0",
                      "preview": "preview/external.png"
                    }
                    """
                ).strip()
                + "\n",
                encoding="utf-8",
            )

            registry = DesignRegistry(
                default_plugin_id="default",
                external_design_package_paths=(str(package_dir),),
            )

            plugin = registry.get("external-design")
            self.assertEqual(plugin.plugin_id, "external-design")

    def test_incompatible_design_api_is_rejected_and_falls_back(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            package_dir = Path(temp_dir) / "incompatible_external"
            package_dir.mkdir(parents=True)
            (package_dir / "__init__.py").write_text(
                textwrap.dedent(
                    """
                    from dataclasses import dataclass
                    from designs.base import DesignPlugin
                    from designs.default import JsonRendererFactory


                    @dataclass(slots=True)
                    class IncompatiblePlugin(DesignPlugin):
                        @property
                        def plugin_id(self) -> str:
                            return "incompatible-design"

                        @property
                        def version(self) -> str:
                            return "1.0.0"

                        @property
                        def design_api_version(self) -> str:
                            return "2"

                        @property
                        def token_set(self):
                            return {}

                        @property
                        def renderer_mappings(self):
                            return {
                                "json": JsonRendererFactory(renderer_name="external-json"),
                                "html": JsonRendererFactory(renderer_name="external-html"),
                            }


                    PLUGIN = IncompatiblePlugin()
                    """
                ).strip()
                + "\n",
                encoding="utf-8",
            )
            (package_dir / "design.json").write_text(
                textwrap.dedent(
                    """
                    {
                      "plugin_id": "incompatible-design",
                      "name": "Incompatible",
                      "version": "1.0.0",
                      "design_api_version": "2",
                      "required_editor_version": "1.0.0"
                    }
                    """
                ).strip()
                + "\n",
                encoding="utf-8",
            )

            registry = DesignRegistry(
                default_plugin_id="default",
                external_design_package_paths=(str(package_dir),),
            )

            plugin = registry.get("incompatible-design")
            self.assertEqual(plugin.plugin_id, "default")


if __name__ == "__main__":
    unittest.main()
