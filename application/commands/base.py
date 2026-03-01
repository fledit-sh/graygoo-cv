from __future__ import annotations

from typing import Protocol


class Command(Protocol):
    """Executable mutation with undo support."""

    def execute(self) -> None:
        """Apply the command's mutation."""

    def undo(self) -> None:
        """Revert the command's mutation."""

    def metadata(self) -> dict[str, object]:
        """Serialize command metadata for history persistence."""
