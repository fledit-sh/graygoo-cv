from __future__ import annotations

import unittest

from designs.base import DesignRegistry


class DesignRegistryTests(unittest.TestCase):
    def test_loads_default_plugin_from_designs_folder(self) -> None:
        registry = DesignRegistry(default_plugin_id="default")

        plugin = registry.get("default")

        self.assertEqual(plugin.plugin_id, "default")
        self.assertEqual(plugin.version, "1.0.0")
        self.assertIn("json", plugin.renderer_mappings)
        self.assertIn("color.text.primary", plugin.token_set)

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


if __name__ == "__main__":
    unittest.main()
