from __future__ import annotations

import json
import unittest

from application.editor_controller import EditorController
from core.models import Document, Node, StyleTokenRef


class ApplicationUnitTests(unittest.TestCase):
    def _make_controller(self) -> EditorController:
        root = Node(
            id="root",
            kind="document",
            children=[
                Node(
                    id="p1",
                    kind="paragraph",
                    text="Hello",
                    style_tokens=[StyleTokenRef(token="text.body.primary")],
                )
            ],
        )
        return EditorController(document=Document(id="doc-application", root=root))

    def test_command_bus_history_metadata_roundtrip(self) -> None:
        controller = self._make_controller()

        controller.insert_node(
            "root",
            Node(
                id="p2",
                kind="paragraph",
                text="World",
                style_tokens=[StyleTokenRef(token="text.body.muted")],
            ),
        )
        controller.update_node_props("p2", {"text": "World!"})

        history = controller.export_history_metadata()
        self.assertEqual(len(history), 2)

        restored = self._make_controller()
        restored.restore_history_metadata(history)
        self.assertEqual(restored.export_history_metadata(), history)
        self.assertFalse(restored.undo())
        self.assertFalse(restored.redo())

    def test_design_switch_does_not_mutate_document_payload(self) -> None:
        controller = self._make_controller()

        before = json.dumps(controller.export_document_payload(), sort_keys=True)

        controller.set_active_design("high-contrast")
        controller.set_active_design("default")

        after = json.dumps(controller.export_document_payload(), sort_keys=True)
        self.assertEqual(before, after)

    def test_design_switch_updates_render_state_only(self) -> None:
        controller = self._make_controller()

        default_state = controller.get_render_state()
        controller.set_active_design("high-contrast")
        high_contrast_state = controller.get_render_state()

        self.assertNotEqual(default_state["p1"], high_contrast_state["p1"])
        self.assertEqual(controller.document.root.children[0].text, "Hello")


if __name__ == "__main__":
    unittest.main()
