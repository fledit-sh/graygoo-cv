from __future__ import annotations

import argparse
from pathlib import Path
import sys

from application.editor_controller import EditorController
from application.session import dump_document_payload, dump_history_metadata, load_controller
from core.models import Document, Node
from presentation.qt.main_window import QApplication, QtEditorMainWindow


def _build_default_document() -> Document:
    return Document(
        id="doc-main",
        title="Untitled Document",
        root=Node(id="root", kind="document"),
    )


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Graygoo CV editor")
    parser.add_argument("--document-path", help="Path to a document payload JSON file")
    parser.add_argument("--history-path", help="Path to command history metadata JSON file")
    parser.add_argument("--settings-path", help="Path to app settings JSON file")
    parser.add_argument(
        "--save-document-path",
        help="Path to write document payload when the application exits",
    )
    parser.add_argument(
        "--save-history-path",
        help="Path to write history metadata when the application exits",
    )
    return parser


def _build_controller(args: argparse.Namespace) -> EditorController:
    if args.document_path:
        return load_controller(
            document_path=args.document_path,
            history_path=args.history_path,
            settings_path=args.settings_path,
        )

    if args.history_path or args.settings_path:
        raise ValueError("--history-path/--settings-path require --document-path.")

    return EditorController(document=_build_default_document())


def _save_on_exit(controller: EditorController, args: argparse.Namespace) -> None:
    if args.save_document_path:
        dump_document_payload(controller, Path(args.save_document_path))
    if args.save_history_path:
        dump_history_metadata(controller, Path(args.save_history_path))


def main(argv: list[str] | None = None) -> int:
    startup_args = list(argv) if argv is not None else sys.argv[1:]
    parser = _build_parser()

    try:
        args = parser.parse_args(startup_args)
        controller = _build_controller(args)
    except (OSError, ValueError) as exc:
        print(f"Startup error: {exc}", file=sys.stderr)
        return 1

    app = QApplication(sys.argv)
    window = QtEditorMainWindow(controller=controller)
    window.show()
    exit_code = app.exec()

    try:
        _save_on_exit(controller, args)
    except OSError as exc:
        print(f"Shutdown error: {exc}", file=sys.stderr)
        return 1

    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
