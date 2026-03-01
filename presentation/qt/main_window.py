from __future__ import annotations

from typing import Any, Callable

from application.editor_controller import EditorController
from core.models import Node, StyleTokenRef
from presentation.main_window import DocumentViewModel, EditorMainWindow

try:
    from PySide6.QtCore import Qt, Signal, Slot
    from PySide6.QtWidgets import (
        QApplication,
        QDockWidget,
        QLabel,
        QMainWindow,
        QPushButton,
        QTextEdit,
        QTreeWidget,
        QWidget,
    )
except ModuleNotFoundError:
    try:
        from PyQt6.QtCore import Qt, pyqtSignal as Signal, pyqtSlot as Slot
        from PyQt6.QtWidgets import (
            QApplication,
            QDockWidget,
            QLabel,
            QMainWindow,
            QPushButton,
            QTextEdit,
            QTreeWidget,
            QWidget,
        )
    except ModuleNotFoundError:
        class _BoundSignal:
            def __init__(self) -> None:
                self._callbacks: list[Callable[..., None]] = []

            def connect(self, callback: Callable[..., None]) -> None:
                self._callbacks.append(callback)

            def emit(self, *args: Any) -> None:
                for callback in tuple(self._callbacks):
                    callback(*args)

        class Signal:  # type: ignore[override]
            def __init__(self, *_args: Any) -> None:
                self._name = ""

            def __set_name__(self, _owner: type[object], name: str) -> None:
                self._name = f"__signal_{name}"

            def __get__(self, instance: object | None, _owner: type[object]) -> _BoundSignal | Signal:
                if instance is None:
                    return self
                signal = getattr(instance, self._name, None)
                if signal is None:
                    signal = _BoundSignal()
                    setattr(instance, self._name, signal)
                return signal

        def Slot(*_args: Any, **_kwargs: Any) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
            def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
                return func

            return decorator

        class Qt:
            class DockWidgetArea:
                LeftDockWidgetArea = "left"
                RightDockWidgetArea = "right"
                BottomDockWidgetArea = "bottom"
                TopDockWidgetArea = "top"

        class QApplication:
            def __init__(self, _argv: list[str]) -> None:
                self._exit_code = 0

            def exec(self) -> int:
                return self._exit_code

        class QWidget:
            def __init__(self, _parent: QWidget | None = None) -> None:
                self._object_name = ""

            def setObjectName(self, name: str) -> None:
                self._object_name = name

        class QMainWindow(QWidget):
            def __init__(self, parent: QWidget | None = None) -> None:
                super().__init__(parent)
                self._central_widget: QWidget | None = None
                self._qt_dock_widgets: list[tuple[str, QDockWidget]] = []

            def setWindowTitle(self, _title: str) -> None:
                return

            def resize(self, _width: int, _height: int) -> None:
                return

            def addDockWidget(self, area: str, dock_widget: QDockWidget) -> None:
                self._qt_dock_widgets.append((area, dock_widget))

            def setCentralWidget(self, widget: QWidget) -> None:
                self._central_widget = widget

            def show(self) -> None:
                return

        class QDockWidget(QWidget):
            def __init__(self, _title: str, parent: QWidget | None = None) -> None:
                super().__init__(parent)
                self._widget: QWidget | None = None

            def setWidget(self, widget: QWidget) -> None:
                self._widget = widget

            def widget(self) -> QWidget | None:
                return self._widget

        class QLabel(QWidget):
            def __init__(self, _text: str, parent: QWidget | None = None) -> None:
                super().__init__(parent)

        class QTextEdit(QWidget):
            def setPlaceholderText(self, _text: str) -> None:
                return

        class QTreeWidget(QWidget):
            def setHeaderLabel(self, _text: str) -> None:
                return

        class QPushButton(QWidget):
            def __init__(self, _text: str, parent: QWidget | None = None) -> None:
                super().__init__(parent)
                self.clicked = _BoundSignal()


class QtEditorMainWindow(QMainWindow):
    """Qt adapter that bridges widget events/signals to the domain editor window."""

    request_add_node = Signal(str, object, object)
    design_changed = Signal(str)
    full_refresh_requested = Signal(object)

    def __init__(self, controller: EditorController, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self._editor_window = EditorMainWindow(controller=controller)

        self.setWindowTitle("Graygoo CV Editor")
        self.resize(1280, 800)

        self._dock_widgets: dict[str, QDockWidget] = {}
        self._build_docks()
        self._wire_domain_to_qt()
        self._wire_qt_to_domain()

    @property
    def editor_window(self) -> EditorMainWindow:
        return self._editor_window

    def _build_docks(self) -> None:
        for panel in self._editor_window.panels.values():
            dock = QDockWidget(panel.title, self)
            dock.setObjectName(panel.panel_id)
            dock.setWidget(self._create_panel_widget(panel.panel_id))
            self._dock_widgets[panel.panel_id] = dock

            if panel.panel_id == "canvas":
                widget = dock.widget()
                if widget is not None:
                    self.setCentralWidget(widget)
                continue

            self.addDockWidget(self._to_qt_dock_area(panel.dock_area), dock)

    def _create_panel_widget(self, panel_id: str) -> QWidget:
        if panel_id == "canvas":
            canvas_widget = QTextEdit(self)
            canvas_widget.setObjectName("canvas_view")
            canvas_widget.setPlaceholderText("Canvas preview / document designer")
            return canvas_widget

        if panel_id == "layers":
            layers_widget = QTreeWidget(self)
            layers_widget.setObjectName("layers_tree")
            layers_widget.setHeaderLabel("Document Nodes")
            return layers_widget

        if panel_id == "inspector":
            add_node_button = QPushButton("Add paragraph node", self)
            add_node_button.setObjectName("inspector_form")
            add_node_button.clicked.connect(self._emit_default_add_node_request)
            return add_node_button

        assets_widget = QLabel("Assets panel", self)
        assets_widget.setObjectName("assets_grid")
        return assets_widget

    def _wire_domain_to_qt(self) -> None:
        self._editor_window.design_changed.connect(self.design_changed.emit)
        self._editor_window.full_refresh_requested.connect(self.full_refresh_requested.emit)

    def _wire_qt_to_domain(self) -> None:
        self.request_add_node.connect(self._on_request_add_node)

    @Slot(str, object, object)
    def _on_request_add_node(self, parent_id: str, node: Node, index: int | None = None) -> None:
        self._editor_window.request_add_node(parent_id=parent_id, node=node, index=index)

    @Slot()
    def _emit_default_add_node_request(self) -> None:
        node = Node(
            id="qt-node",
            kind="paragraph",
            text="New node from Qt",
            style_tokens=[StyleTokenRef(token="text.body.primary")],
        )
        self.request_add_node.emit("root", node, None)

    @staticmethod
    def _to_qt_dock_area(dock_area: str) -> Qt.DockWidgetArea:
        mapping = {
            "left": Qt.DockWidgetArea.LeftDockWidgetArea,
            "right": Qt.DockWidgetArea.RightDockWidgetArea,
            "bottom": Qt.DockWidgetArea.BottomDockWidgetArea,
            "top": Qt.DockWidgetArea.TopDockWidgetArea,
        }
        return mapping.get(dock_area, Qt.DockWidgetArea.LeftDockWidgetArea)


__all__ = ["QApplication", "QtEditorMainWindow", "DocumentViewModel"]
