from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from core.models import Node, StyleTokenRef


class TokenResolutionError(KeyError):
    """Raised when a token key cannot be resolved in the active design."""


def resolve_token(token_set: Mapping[str, Any], token_key: str) -> Any:
    """Resolve a namespaced token key (for example `text.heading.primary`)."""

    parts = token_key.split(".")
    current: Any = token_set

    for part in parts:
        if not isinstance(current, Mapping) or part not in current:
            raise TokenResolutionError(f"Unknown token key '{token_key}'")
        current = current[part]

    return current


def resolve_style_tokens(
    token_set: Mapping[str, Any],
    style_tokens: list[StyleTokenRef],
) -> dict[str, Any]:
    """Resolve semantic token refs into concrete values for rendering only."""

    resolved: dict[str, Any] = {}
    for style_token in style_tokens:
        resolved[style_token.token] = resolve_token(token_set, style_token.token)
    return resolved


def build_render_state(token_set: Mapping[str, Any], root: Node) -> dict[str, dict[str, Any]]:
    """Build a runtime-only style map keyed by node id.

    The returned structure is detached from document state so design switches can re-render
    by recomputing this mapping without modifying document content.
    """

    state: dict[str, dict[str, Any]] = {}

    def walk(node: Node) -> None:
        state[node.id] = resolve_style_tokens(token_set, node.style_tokens)
        for child in node.children:
            walk(child)

    walk(root)
    return state
