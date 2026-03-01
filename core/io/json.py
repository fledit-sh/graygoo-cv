from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from core.models import Document


def loads_document(payload: str) -> Document:
    """Deserialize a JSON string into a Document model."""

    data: dict[str, Any] = json.loads(payload)
    return Document.from_dict(data)


def load_document(path: str | Path, encoding: str = "utf-8") -> Document:
    """Deserialize a JSON file into a Document model."""

    file_path = Path(path)
    return loads_document(file_path.read_text(encoding=encoding))


def dumps_document(document: Document, *, indent: int = 2) -> str:
    """Serialize a Document model to a JSON string."""

    return json.dumps(document.to_dict(), indent=indent, ensure_ascii=False)


def dump_document(
    document: Document,
    path: str | Path,
    *,
    indent: int = 2,
    encoding: str = "utf-8",
) -> None:
    """Serialize a Document model into a JSON file."""

    file_path = Path(path)
    file_path.write_text(dumps_document(document, indent=indent), encoding=encoding)
