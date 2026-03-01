from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class StyleTokenRef:
    """Reference to a semantic style token (not concrete visual properties)."""

    token: str
    variant: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "StyleTokenRef":
        return cls(
            token=data["token"],
            variant=data.get("variant"),
            metadata=dict(data.get("metadata", {})),
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "token": self.token,
            "variant": self.variant,
            "metadata": self.metadata,
        }


@dataclass(slots=True)
class AssetRef:
    """Pointer to externally managed content such as images, attachments, or media."""

    id: str
    uri: str
    kind: str = "generic"
    title: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "AssetRef":
        return cls(
            id=data["id"],
            uri=data["uri"],
            kind=data.get("kind", "generic"),
            title=data.get("title"),
            metadata=dict(data.get("metadata", {})),
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "uri": self.uri,
            "kind": self.kind,
            "title": self.title,
            "metadata": self.metadata,
        }


@dataclass(slots=True)
class Node:
    """Structured semantic content node independent from any UI framework."""

    id: str
    kind: str
    text: str | None = None
    heading_level: int | None = None
    emphasis: bool = False
    style_tokens: list[StyleTokenRef] = field(default_factory=list)
    asset_ref: AssetRef | None = None
    children: list["Node"] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Node":
        return cls(
            id=data["id"],
            kind=data["kind"],
            text=data.get("text"),
            heading_level=data.get("heading_level"),
            emphasis=bool(data.get("emphasis", False)),
            style_tokens=[
                StyleTokenRef.from_dict(token) for token in data.get("style_tokens", [])
            ],
            asset_ref=AssetRef.from_dict(data["asset_ref"])
            if data.get("asset_ref")
            else None,
            children=[Node.from_dict(child) for child in data.get("children", [])],
            metadata=dict(data.get("metadata", {})),
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "kind": self.kind,
            "text": self.text,
            "heading_level": self.heading_level,
            "emphasis": self.emphasis,
            "style_tokens": [token.to_dict() for token in self.style_tokens],
            "asset_ref": self.asset_ref.to_dict() if self.asset_ref else None,
            "children": [child.to_dict() for child in self.children],
            "metadata": self.metadata,
        }


@dataclass(slots=True)
class Document:
    """Top-level semantic document containing content nodes and asset references."""

    id: str
    root: Node
    title: str | None = None
    assets: dict[str, AssetRef] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Document":
        return cls(
            id=data["id"],
            title=data.get("title"),
            root=Node.from_dict(data["root"]),
            assets={
                key: AssetRef.from_dict(value)
                for key, value in data.get("assets", {}).items()
            },
            metadata=dict(data.get("metadata", {})),
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "root": self.root.to_dict(),
            "assets": {key: asset.to_dict() for key, asset in self.assets.items()},
            "metadata": self.metadata,
        }
