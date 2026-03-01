from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from application.editor_controller import EditorController
from application.session import dump_document_payload, dump_history_metadata, load_controller
from core.models import Document, Node, StyleTokenRef


class EditorControllerTests(unittest.TestCase):
    def _make_controller(self) -> EditorController:
        root = Node(
            id="root",
            kind="document",
            children=[
                Node(
                    id="n1",
                    kind="paragraph",
                    text="A",
                    style_tokens=[StyleTokenRef(token="text.body.primary")],
                )
            ],
        )
        doc = Document(id="doc-1", title="Test", root=root)
        return EditorController(document=doc)

    def test_insert_delete_update_with_undo_redo(self) -> None:
        controller = self._make_controller()

        controller.insert_node(
            "root",
            Node(
                id="n2",
                kind="paragraph",
                text="B",
                style_tokens=[StyleTokenRef(token="text.body.muted")],
            ),
        )
        self.assertEqual([n.id for n in controller.document.root.children], ["n1", "n2"])

        controller.update_node_props("n2", {"text": "B2", "emphasis": True})
        inserted = controller.document.root.children[1]
        self.assertEqual(inserted.text, "B2")
        self.assertTrue(inserted.emphasis)

        controller.delete_node("n1")
        self.assertEqual([n.id for n in controller.document.root.children], ["n2"])

        self.assertTrue(controller.undo())
        self.assertEqual([n.id for n in controller.document.root.children], ["n1", "n2"])

        self.assertTrue(controller.undo())
        self.assertEqual(controller.document.root.children[1].text, "B")
        self.assertFalse(controller.document.root.children[1].emphasis)

        self.assertTrue(controller.redo())
        self.assertEqual(controller.document.root.children[1].text, "B2")

    def test_persist_document_and_history_separately(self) -> None:
        controller = self._make_controller()
        controller.on_add_node(
            "root",
            Node(
                id="n2",
                kind="paragraph",
                text="B",
                style_tokens=[StyleTokenRef(token="spacing.sm")],
            ),
        )
        controller.on_edit_node("n2", text="edited")

        with tempfile.TemporaryDirectory() as temp_dir:
            document_path = Path(temp_dir) / "document.json"
            history_path = Path(temp_dir) / "history.json"

            dump_document_payload(controller, document_path)
            dump_history_metadata(controller, history_path)

            stored_doc = json.loads(document_path.read_text(encoding="utf-8"))
            stored_history = json.loads(history_path.read_text(encoding="utf-8"))

            self.assertIn("root", stored_doc)
            self.assertIsInstance(stored_history, list)
            self.assertGreaterEqual(len(stored_history), 2)

            restored = load_controller(document_path=document_path, history_path=history_path)
            self.assertEqual(restored.document.root.children[1].text, "edited")
            self.assertEqual(len(restored.export_history_metadata()), len(stored_history))

    def test_design_switch_recomputes_render_state_without_mutating_document(self) -> None:
        controller = self._make_controller()
        before_payload = controller.export_document_payload()

        default_state = controller.get_render_state()
        controller.set_active_design("high-contrast")
        high_contrast_state = controller.get_render_state()

        self.assertEqual(before_payload, controller.export_document_payload())
        self.assertNotEqual(default_state["n1"], high_contrast_state["n1"])


if __name__ == "__main__":
    unittest.main()
