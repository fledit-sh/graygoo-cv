from __future__ import annotations

from pathlib import Path
import sys

from application.editor_controller import EditorController
from core.io.json import load_document
from core.models import Document, Node
from presentation.main_window import EditorMainWindow


def _build_default_document() -> Document:
    return Document(
        id="doc-main",
        title="Untitled Document",
        root=Node(id="root", kind="document"),
    )


def _load_or_create_document(argv: list[str]) -> Document:
    if not argv:
        return _build_default_document()

    document_path = Path(argv[0])
    if document_path.exists():
        return load_document(document_path)

    return _build_default_document()


def main(argv: list[str] | None = None) -> int:
    startup_args = list(argv) if argv is not None else sys.argv[1:]

    document = _load_or_create_document(startup_args)
    controller = EditorController(document=document)
    ui_shell = EditorMainWindow(controller=controller)

    # Startup wiring for framework adapters (Qt window integration) stays localized here.
    _ = ui_shell
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
