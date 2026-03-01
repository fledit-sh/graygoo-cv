from __future__ import annotations

from dataclasses import dataclass, field
from types import MappingProxyType
from typing import Any, Callable, Generic, Protocol, TypeVar

from application.editor_controller import EditorController
from core.models import AssetRef, Document, Node, StyleTokenRef

T = TypeVar("T")


class UISignal(Generic[T]):
    """Lightweight signal helper for non-framework UI tests and adapters."""

    def __init__(self) -> None:
        self._subscribers: list[Callable[[T], None]] = []

    def connect(self, callback: Callable[[T], None]) -> None:
        self._subscribers.append(callback)

    def emit(self, payload: T) -> None:
        for callback in tuple(self._subscribers):
            callback(payload)


class UIAction:
    """Action object that mimics command palette/menu action triggers."""

    def __init__(self) -> None:
        self._handlers: list[Callable[[], None]] = []

    def connect(self, callback: Callable[[], None]) -> None:
        self._handlers.append(callback)

    def trigger(self) -> None:
        for callback in tuple(self._handlers):
            callback()


@dataclass(frozen=True, slots=True)
class DockPanel:
    panel_id: str
    title: str
    dock_area: str
    widget_ref: str


@dataclass(frozen=True, slots=True)
class StyleTokenViewModel:
    token: str
    variant: str | None
    metadata: MappingProxyType[str, Any]


@dataclass(frozen=True, slots=True)
class AssetViewModel:
    id: str
    uri: str
    kind: str
    title: str | None
    metadata: MappingProxyType[str, Any]


@dataclass(frozen=True, slots=True)
class NodeViewModel:
    id: str
    kind: str
    text: str | None
    heading_level: int | None
    emphasis: bool
    style_tokens: tuple[StyleTokenViewModel, ...]
    asset_ref: AssetViewModel | None
    children: tuple["NodeViewModel", ...]
    metadata: MappingProxyType[str, Any]


@dataclass(frozen=True, slots=True)
class DocumentViewModel:
    id: str
    title: str | None
    root: NodeViewModel
    assets: MappingProxyType[str, AssetViewModel]
    metadata: MappingProxyType[str, Any]


class DesignPresenter(Protocol):
    """Design-dependent presenters consume immutable view models only."""

    def render(
        self,
        document: DocumentViewModel,
        render_state: MappingProxyType[str, MappingProxyType[str, Any]],
    ) -> None: ...


@dataclass(slots=True)
class EditorMainWindow:
    """Main editor window shell with dockable panels and design switching."""

    controller: EditorController
    panels: dict[str, DockPanel] = field(default_factory=dict, init=False)
    add_node_action: UIAction = field(default_factory=UIAction, init=False)
    remove_node_action: UIAction = field(default_factory=UIAction, init=False)
    edit_node_action: UIAction = field(default_factory=UIAction, init=False)
    undo_action: UIAction = field(default_factory=UIAction, init=False)
    redo_action: UIAction = field(default_factory=UIAction, init=False)
    design_switch_action: UIAction = field(default_factory=UIAction, init=False)
    design_changed: UISignal[str] = field(default_factory=UISignal, init=False)
    full_refresh_requested: UISignal[DocumentViewModel] = field(default_factory=UISignal, init=False)
    available_design_ids: tuple[str, ...] = field(default_factory=tuple, init=False)
    _pending_add_node: tuple[str, Node, int | None] | None = field(default=None, init=False)
    _pending_remove_node_id: str | None = field(default=None, init=False)
    _pending_edit_node: tuple[str, dict[str, Any]] | None = field(default=None, init=False)
    _pending_design_id: str | None = field(default=None, init=False)

    def __post_init__(self) -> None:
        self._setup_dockable_panels()
        self._setup_action_bindings()
        self._load_design_selector_options()
        self.refresh_visual_state()

    def _setup_dockable_panels(self) -> None:
        self.panels = {
            "canvas": DockPanel("canvas", "Canvas", "center", "canvas_view"),
            "layers": DockPanel("layers", "Layers / Outliner", "left", "layers_tree"),
            "inspector": DockPanel("inspector", "Properties Inspector", "right", "inspector_form"),
            "assets": DockPanel("assets", "Asset Browser", "bottom", "assets_grid"),
        }

    def _setup_action_bindings(self) -> None:
        self.add_node_action.connect(self._dispatch_add_node)
        self.remove_node_action.connect(self._dispatch_remove_node)
        self.edit_node_action.connect(self._dispatch_edit_node)
        self.undo_action.connect(self.controller.undo)
        self.redo_action.connect(self.controller.redo)
        self.design_switch_action.connect(self._activate_selected_design)
        self.design_changed.connect(self._on_design_changed)

    def _load_design_selector_options(self) -> None:
        self.available_design_ids = self.controller.design_registry.available_design_ids()

    def request_add_node(self, parent_id: str, node: Node, index: int | None = None) -> None:
        self._pending_add_node = (parent_id, node, index)
        self.add_node_action.trigger()
        self.refresh_visual_state()

    def request_remove_node(self, node_id: str) -> None:
        self._pending_remove_node_id = node_id
        self.remove_node_action.trigger()
        self.refresh_visual_state()

    def request_edit_node(self, node_id: str, **props: Any) -> None:
        self._pending_edit_node = (node_id, props)
        self.edit_node_action.trigger()
        self.refresh_visual_state()

    def request_switch_design(self, design_id: str) -> None:
        self._pending_design_id = design_id
        self.design_switch_action.trigger()

    def request_undo(self) -> None:
        self.undo_action.trigger()
        self.refresh_visual_state()

    def request_redo(self) -> None:
        self.redo_action.trigger()
        self.refresh_visual_state()

    def _dispatch_add_node(self) -> None:
        if self._pending_add_node is None:
            return

        parent_id, node, index = self._pending_add_node
        self.controller.on_add_node(parent_id=parent_id, node=node, index=index)
        self._pending_add_node = None

    def _dispatch_remove_node(self) -> None:
        if not self._pending_remove_node_id:
            return

        self.controller.on_remove_node(node_id=self._pending_remove_node_id)
        self._pending_remove_node_id = None

    def _dispatch_edit_node(self) -> None:
        if self._pending_edit_node is None:
            return

        node_id, props = self._pending_edit_node
        self.controller.on_edit_node(node_id=node_id, **props)
        self._pending_edit_node = None

    def _activate_selected_design(self) -> None:
        if not self._pending_design_id:
            return

        activated_plugin = self.controller.design_registry.activate(self._pending_design_id)
        self._pending_design_id = None
        self.design_changed.emit(activated_plugin.plugin_id)

    def _on_design_changed(self, design_id: str) -> None:
        self.controller.set_active_design(design_id)
        self.refresh_visual_state()

    def refresh_visual_state(self) -> DocumentViewModel:
        document_view = build_document_view_model(self.controller.document)
        self.full_refresh_requested.emit(document_view)
        return document_view


def build_document_view_model(document: Document) -> DocumentViewModel:
    assets = {
        asset_id: _asset_to_view_model(asset)
        for asset_id, asset in document.assets.items()
    }
    return DocumentViewModel(
        id=document.id,
        title=document.title,
        root=_node_to_view_model(document.root),
        assets=MappingProxyType(assets),
        metadata=MappingProxyType(dict(document.metadata)),
    )


def _style_token_to_view_model(token: StyleTokenRef) -> StyleTokenViewModel:
    return StyleTokenViewModel(
        token=token.token,
        variant=token.variant,
        metadata=MappingProxyType(dict(token.metadata)),
    )


def _asset_to_view_model(asset: AssetRef) -> AssetViewModel:
    return AssetViewModel(
        id=asset.id,
        uri=asset.uri,
        kind=asset.kind,
        title=asset.title,
        metadata=MappingProxyType(dict(asset.metadata)),
    )


def _node_to_view_model(node: Node) -> NodeViewModel:
    return NodeViewModel(
        id=node.id,
        kind=node.kind,
        text=node.text,
        heading_level=node.heading_level,
        emphasis=node.emphasis,
        style_tokens=tuple(_style_token_to_view_model(token) for token in node.style_tokens),
        asset_ref=_asset_to_view_model(node.asset_ref) if node.asset_ref else None,
        children=tuple(_node_to_view_model(child) for child in node.children),
        metadata=MappingProxyType(dict(node.metadata)),
    )
