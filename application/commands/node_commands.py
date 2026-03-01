from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any

from core.models import Document, Node


class NodeNotFoundError(ValueError):
    """Raised when a node cannot be located by id."""


def _find_node(node: Node, node_id: str) -> Node | None:
    if node.id == node_id:
        return node
    for child in node.children:
        candidate = _find_node(child, node_id)
        if candidate:
            return candidate
    return None


def _find_parent(node: Node, child_id: str) -> tuple[Node, int] | None:
    for index, child in enumerate(node.children):
        if child.id == child_id:
            return node, index
        candidate = _find_parent(child, child_id)
        if candidate:
            return candidate
    return None


@dataclass(slots=True)
class InsertNode:
    document: Document
    parent_id: str
    node: Node
    index: int | None = None
    _resolved_index: int | None = field(default=None, init=False)

    def execute(self) -> None:
        parent = _find_node(self.document.root, self.parent_id)
        if not parent:
            raise NodeNotFoundError(f"Parent node '{self.parent_id}' not found")

        insert_index = self.index if self.index is not None else len(parent.children)
        if insert_index < 0 or insert_index > len(parent.children):
            raise IndexError("Insert index is out of bounds")

        parent.children.insert(insert_index, self.node)
        self._resolved_index = insert_index

    def undo(self) -> None:
        if self._resolved_index is None:
            return

        parent_context = _find_parent(self.document.root, self.node.id)
        if not parent_context:
            raise NodeNotFoundError(f"Inserted node '{self.node.id}' not found")
        parent, index = parent_context
        parent.children.pop(index)

    def metadata(self) -> dict[str, object]:
        return {
            "command": "InsertNode",
            "parent_id": self.parent_id,
            "node_id": self.node.id,
            "index": self._resolved_index if self._resolved_index is not None else self.index,
            "timestamp": datetime.now(UTC).isoformat(),
        }


@dataclass(slots=True)
class DeleteNode:
    document: Document
    node_id: str
    _deleted_node: Node | None = field(default=None, init=False)
    _parent_id: str | None = field(default=None, init=False)
    _index: int | None = field(default=None, init=False)

    def execute(self) -> None:
        context = _find_parent(self.document.root, self.node_id)
        if not context:
            raise NodeNotFoundError(f"Node '{self.node_id}' not found")

        parent, index = context
        self._deleted_node = parent.children.pop(index)
        self._parent_id = parent.id
        self._index = index

    def undo(self) -> None:
        if self._deleted_node is None or self._parent_id is None or self._index is None:
            return

        parent = _find_node(self.document.root, self._parent_id)
        if not parent:
            raise NodeNotFoundError(f"Parent node '{self._parent_id}' not found")

        parent.children.insert(self._index, self._deleted_node)

    def metadata(self) -> dict[str, object]:
        return {
            "command": "DeleteNode",
            "node_id": self.node_id,
            "parent_id": self._parent_id,
            "index": self._index,
            "timestamp": datetime.now(UTC).isoformat(),
        }


@dataclass(slots=True)
class UpdateNodeProps:
    document: Document
    node_id: str
    props: dict[str, Any]
    _previous: dict[str, Any] = field(default_factory=dict, init=False)

    def execute(self) -> None:
        node = _find_node(self.document.root, self.node_id)
        if not node:
            raise NodeNotFoundError(f"Node '{self.node_id}' not found")

        for key, value in self.props.items():
            if not hasattr(node, key):
                raise AttributeError(f"Node has no property '{key}'")
            self._previous[key] = getattr(node, key)
            setattr(node, key, value)

    def undo(self) -> None:
        node = _find_node(self.document.root, self.node_id)
        if not node:
            raise NodeNotFoundError(f"Node '{self.node_id}' not found")

        for key, value in self._previous.items():
            setattr(node, key, value)

    def metadata(self) -> dict[str, object]:
        return {
            "command": "UpdateNodeProps",
            "node_id": self.node_id,
            "props": self.props,
            "timestamp": datetime.now(UTC).isoformat(),
        }
