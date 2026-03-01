from __future__ import annotations

import unittest

from application.editor_controller import EditorController
from core.models import Document, Node, StyleTokenRef
from presentation.main_window import EditorMainWindow, build_document_view_model


class MainWindowTests(unittest.TestCase):
    def _make_controller(self) -> EditorController:
        doc = Document(
            id="doc-1",
            title="Demo",
            root=Node(
                id="root",
                kind="document",
                children=[
                    Node(
                        id="n1",
                        kind="paragraph",
                        text="hello",
                        style_tokens=[StyleTokenRef(token="text.body.primary")],
                    )
                ],
            ),
        )
        return EditorController(document=doc)

    def test_main_window_registers_required_dock_panels(self) -> None:
        window = EditorMainWindow(controller=self._make_controller())

        self.assertEqual(set(window.panels), {"canvas", "layers", "inspector", "assets"})
        self.assertEqual(window.panels["canvas"].dock_area, "center")
        self.assertEqual(window.panels["layers"].title, "Layers / Outliner")

    def test_actions_are_wired_to_editor_controller_methods(self) -> None:
        controller = self._make_controller()
        window = EditorMainWindow(controller=controller)

        window.request_add_node(
            parent_id="root",
            node=Node(
                id="n2",
                kind="paragraph",
                text="new",
                style_tokens=[StyleTokenRef(token="text.body.muted")],
            ),
        )
        self.assertEqual([node.id for node in controller.document.root.children], ["n1", "n2"])

        window.request_edit_node("n2", text="updated")
        self.assertEqual(controller.document.root.children[1].text, "updated")

        window.request_remove_node("n1")
        self.assertEqual([node.id for node in controller.document.root.children], ["n2"])

        window.request_undo()
        self.assertEqual([node.id for node in controller.document.root.children], ["n1", "n2"])

    def test_design_switch_uses_registry_activate_and_emits_refresh(self) -> None:
        controller = self._make_controller()
        window = EditorMainWindow(controller=controller)
        refreshes: list[str] = []
        window.full_refresh_requested.connect(lambda doc: refreshes.append(doc.id))

        window.request_switch_design("high-contrast")

        self.assertEqual(controller.active_design_id, "high-contrast")
        self.assertGreaterEqual(len(refreshes), 1)

    def test_document_view_model_is_immutable(self) -> None:
        view_model = build_document_view_model(self._make_controller().document)

        with self.assertRaises(TypeError):
            view_model.metadata["mutable"] = True  # type: ignore[index]

        with self.assertRaises(TypeError):
            view_model.root.metadata["mutable"] = True  # type: ignore[index]


if __name__ == "__main__":
    unittest.main()
