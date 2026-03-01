from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from application.editor_controller import EditorController
from core.models import Document


def dump_document_payload(controller: EditorController, path: str | Path) -> None:
    """Persist only document payload."""

    Path(path).write_text(
        json.dumps(controller.export_document_payload(), indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


def dump_history_metadata(controller: EditorController, path: str | Path) -> None:
    """Persist command history metadata separately for session restoration."""

    Path(path).write_text(
        json.dumps(controller.export_history_metadata(), indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


def load_controller(
    document_path: str | Path,
    history_path: str | Path | None = None,
) -> EditorController:
    """Restore controller from separated document/history storage."""

    document_data: dict[str, Any] = json.loads(Path(document_path).read_text(encoding="utf-8"))
    controller = EditorController(document=Document.from_dict(document_data))

    if history_path and Path(history_path).exists():
        history_data = json.loads(Path(history_path).read_text(encoding="utf-8"))
        if isinstance(history_data, list):
            controller.restore_history_metadata(history_data)

    return controller
