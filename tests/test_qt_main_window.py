from __future__ import annotations

import unittest

from application.editor_controller import EditorController
from core.models import Document, Node, StyleTokenRef
from presentation.qt.main_window import QtEditorMainWindow


class QtMainWindowTests(unittest.TestCase):
    def _make_controller(self) -> EditorController:
        root = Node(
            id="root",
            kind="document",
            children=[
                Node(
                    id="n1",
                    kind="paragraph",
                    text="Hello",
                    style_tokens=[StyleTokenRef(token="text.body.primary")],
                )
            ],
        )
        return EditorController(document=Document(id="doc-qt", root=root))

    def test_builds_required_dock_widgets(self) -> None:
        window = QtEditorMainWindow(controller=self._make_controller())

        self.assertEqual(set(window._dock_widgets), {"canvas", "layers", "inspector", "assets"})

    def test_request_add_node_signal_dispatches_to_domain_window(self) -> None:
        controller = self._make_controller()
        window = QtEditorMainWindow(controller=controller)

        new_node = Node(
            id="qt-new",
            kind="paragraph",
            text="Added from Qt signal",
            style_tokens=[StyleTokenRef(token="text.body.muted")],
        )
        window.request_add_node.emit("root", new_node, None)

        self.assertEqual(controller.document.root.children[-1].id, "qt-new")

    def test_domain_events_are_bridged_to_qt_signals(self) -> None:
        controller = self._make_controller()
        window = QtEditorMainWindow(controller=controller)

        received_refreshes: list[str] = []
        received_design_ids: list[str] = []
        window.full_refresh_requested.connect(lambda doc: received_refreshes.append(doc.id))
        window.design_changed.connect(received_design_ids.append)

        window.editor_window.refresh_visual_state()
        window.editor_window.request_switch_design("high-contrast")

        self.assertIn("doc-qt", received_refreshes)
        self.assertIn("high-contrast", received_design_ids)


if __name__ == "__main__":
    unittest.main()
