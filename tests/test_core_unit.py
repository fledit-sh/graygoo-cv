from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from core.io.json import dump_document, dumps_document, load_document, loads_document
from core.models import AssetRef, Document, Node, StyleTokenRef


class CoreUnitTests(unittest.TestCase):
    def _make_document(self) -> Document:
        return Document(
            id="doc-core",
            title="Core Test",
            root=Node(
                id="root",
                kind="document",
                children=[
                    Node(
                        id="heading-1",
                        kind="heading",
                        text="Heading",
                        heading_level=1,
                        style_tokens=[StyleTokenRef(token="text.heading.primary")],
                    ),
                    Node(
                        id="paragraph-1",
                        kind="paragraph",
                        text="Body",
                        style_tokens=[StyleTokenRef(token="text.body.primary")],
                    ),
                ],
            ),
            assets={
                "logo": AssetRef(
                    id="logo",
                    uri="https://example.com/logo.svg",
                    kind="image",
                )
            },
            metadata={"source": "unit-test"},
        )

    def test_document_json_roundtrip_string_and_file(self) -> None:
        document = self._make_document()

        as_json = dumps_document(document)
        from_json = loads_document(as_json)
        self.assertEqual(from_json.to_dict(), document.to_dict())

        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "document.json"
            dump_document(document, path)
            from_file = load_document(path)

        self.assertEqual(from_file.to_dict(), document.to_dict())

    def test_style_token_ref_rejects_concrete_style_values(self) -> None:
        with self.assertRaises(ValueError):
            StyleTokenRef(token="#0f0f0f")

        with self.assertRaises(ValueError):
            StyleTokenRef(token="12px")

    def test_document_payload_is_stable_json(self) -> None:
        payload = self._make_document().to_dict()

        first = json.dumps(payload, sort_keys=True)
        second = json.dumps(Document.from_dict(payload).to_dict(), sort_keys=True)

        self.assertEqual(first, second)


if __name__ == "__main__":
    unittest.main()
