from __future__ import annotations

import json
import unittest

from application.editor_controller import EditorController
from core.models import Document, Node, StyleTokenRef
from designs.base import DesignPlugin, DesignRegistry
from designs.runtime.token_resolver import resolve_token

REQUIRED_TOKEN_KEYS = (
    "text.heading.primary",
    "text.heading.secondary",
    "text.body.primary",
    "text.body.muted",
    "surface.panel",
    "surface.background",
    "spacing.sm",
    "spacing.md",
    "spacing.section",
)
REQUIRED_RENDERERS = ("json", "html")


class DesignPluginContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.registry = DesignRegistry(default_plugin_id="default")
        self.design_ids = self.registry.available_design_ids()

    def _make_controller(self) -> EditorController:
        return EditorController(
            document=Document(
                id="doc-design-contract",
                root=Node(
                    id="root",
                    kind="document",
                    children=[
                        Node(
                            id="n1",
                            kind="paragraph",
                            text="Sample",
                            style_tokens=[StyleTokenRef(token="text.body.primary")],
                        )
                    ],
                ),
            )
        )

    def test_each_design_plugin_exposes_required_token_keys(self) -> None:
        self.assertGreaterEqual(len(self.design_ids), 1)

        for design_id in self.design_ids:
            plugin = self.registry.get(design_id)
            with self.subTest(design_id=design_id):
                self._assert_required_tokens(plugin)

    def test_each_design_plugin_covers_required_renderers(self) -> None:
        for design_id in self.design_ids:
            plugin = self.registry.get(design_id)
            with self.subTest(design_id=design_id):
                for renderer_name in REQUIRED_RENDERERS:
                    self.assertIn(renderer_name, plugin.renderer_mappings)
                    renderer = plugin.renderer_mappings[renderer_name].create_renderer(renderer_name)
                    self.assertIsNotNone(renderer)

    def test_document_json_is_identical_before_and_after_design_switching(self) -> None:
        controller = self._make_controller()
        before = json.dumps(controller.export_document_payload(), sort_keys=True)

        for design_id in self.design_ids:
            controller.set_active_design(design_id)
            _ = controller.get_render_state()

        controller.set_active_design("default")
        after = json.dumps(controller.export_document_payload(), sort_keys=True)
        self.assertEqual(before, after)

    def _assert_required_tokens(self, plugin: DesignPlugin) -> None:
        for key in REQUIRED_TOKEN_KEYS:
            resolved = resolve_token(plugin.token_set, key)
            self.assertIsNotNone(resolved)


if __name__ == "__main__":
    unittest.main()
