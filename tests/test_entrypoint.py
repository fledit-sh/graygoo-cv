from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from application import entrypoint


class _DummyApp:
    def __init__(self, _argv: list[str]) -> None:
        self._exit_code = 0

    def exec(self) -> int:
        return self._exit_code


class _DummyWindow:
    def __init__(self, controller: object) -> None:
        self.controller = controller

    def show(self) -> None:
        return


class EntrypointTests(unittest.TestCase):
    @patch("application.entrypoint.QtEditorMainWindow", _DummyWindow)
    @patch("application.entrypoint.QApplication", _DummyApp)
    @patch("application.entrypoint.load_controller")
    def test_main_uses_load_controller_when_document_path_is_provided(self, load_controller_mock) -> None:
        load_controller_mock.return_value = object()

        exit_code = entrypoint.main(["--document-path", "doc.json", "--history-path", "hist.json"])

        self.assertEqual(exit_code, 0)
        load_controller_mock.assert_called_once_with(
            document_path="doc.json",
            history_path="hist.json",
            settings_path=None,
        )

    def test_main_returns_startup_error_for_invalid_path_combination(self) -> None:
        with patch("sys.stderr"):
            exit_code = entrypoint.main(["--history-path", "hist.json"])

        self.assertEqual(exit_code, 1)

    @patch("application.entrypoint.QtEditorMainWindow", _DummyWindow)
    @patch("application.entrypoint.QApplication", _DummyApp)
    def test_main_returns_shutdown_error_when_save_fails(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            invalid_target = Path(temp_dir) / "missing" / "document.json"

            with patch("sys.stderr"):
                exit_code = entrypoint.main(["--save-document-path", str(invalid_target)])

        self.assertEqual(exit_code, 1)


if __name__ == "__main__":
    unittest.main()
