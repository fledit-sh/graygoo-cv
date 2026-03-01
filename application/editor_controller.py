from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from application.commands import DeleteNode, InsertNode, UpdateNodeProps
from application.commands.base import Command
from core.models import Document, Node


@dataclass(slots=True)
class CommandBus:
    """Central command executor with undo/redo support."""

    _undo_stack: list[Command] = field(default_factory=list)
    _redo_stack: list[Command] = field(default_factory=list)
    _history_log: list[dict[str, object]] = field(default_factory=list)

    def dispatch(self, command: Command) -> None:
        command.execute()
        self._undo_stack.append(command)
        self._redo_stack.clear()
        self._history_log.append(command.metadata())

    def undo(self) -> bool:
        if not self._undo_stack:
            return False

        command = self._undo_stack.pop()
        command.undo()
        self._redo_stack.append(command)
        return True

    def redo(self) -> bool:
        if not self._redo_stack:
            return False

        command = self._redo_stack.pop()
        command.execute()
        self._undo_stack.append(command)
        self._history_log.append(command.metadata())
        return True

    def clear(self) -> None:
        self._undo_stack.clear()
        self._redo_stack.clear()
        self._history_log.clear()

    def history_metadata(self) -> list[dict[str, object]]:
        """Persistable history metadata independent of document payload."""

        return [dict(entry) for entry in self._history_log]

    def restore_history_metadata(self, history: list[dict[str, object]]) -> None:
        """Restore metadata for session history timelines.

        This repopulates metadata only and intentionally does not reconstruct command objects.
        """

        self._history_log = [dict(entry) for entry in history]
        self._undo_stack.clear()
        self._redo_stack.clear()


@dataclass(slots=True)
class EditorController:
    """Entry point for UI interactions with the document model."""

    document: Document
    command_bus: CommandBus = field(default_factory=CommandBus)

    def insert_node(self, parent_id: str, node: Node, index: int | None = None) -> None:
        self.command_bus.dispatch(
            InsertNode(document=self.document, parent_id=parent_id, node=node, index=index)
        )

    def delete_node(self, node_id: str) -> None:
        self.command_bus.dispatch(DeleteNode(document=self.document, node_id=node_id))

    def update_node_props(self, node_id: str, props: dict[str, Any]) -> None:
        self.command_bus.dispatch(
            UpdateNodeProps(document=self.document, node_id=node_id, props=props)
        )

    # UI-facing aliases to prevent direct model mutation in view layers.
    def on_add_node(self, parent_id: str, node: Node, index: int | None = None) -> None:
        self.insert_node(parent_id=parent_id, node=node, index=index)

    def on_remove_node(self, node_id: str) -> None:
        self.delete_node(node_id=node_id)

    def on_edit_node(self, node_id: str, **props: Any) -> None:
        self.update_node_props(node_id=node_id, props=props)

    def undo(self) -> bool:
        return self.command_bus.undo()

    def redo(self) -> bool:
        return self.command_bus.redo()

    def export_document_payload(self) -> dict[str, Any]:
        """Payload-only serialization for document storage."""

        return self.document.to_dict()

    def export_history_metadata(self) -> list[dict[str, object]]:
        """Metadata-only serialization for command history/session restore."""

        return self.command_bus.history_metadata()

    def restore_history_metadata(self, history: list[dict[str, object]]) -> None:
        self.command_bus.restore_history_metadata(history)
