from __future__ import annotations

import unittest

from core.models import Node, StyleTokenRef
from designs.default import PLUGIN as DEFAULT_PLUGIN
from designs.runtime.token_resolver import (
    TokenResolutionError,
    build_render_state,
    resolve_style_tokens,
    resolve_token,
)


class TokenResolverTests(unittest.TestCase):
    def test_rejects_concrete_style_values_in_style_token_ref(self) -> None:
        with self.assertRaises(ValueError):
            StyleTokenRef(token="#ffffff")

        with self.assertRaises(ValueError):
            StyleTokenRef(token="14px")

    def test_resolves_namespaced_token_key(self) -> None:
        heading = resolve_token(DEFAULT_PLUGIN.token_set, "text.heading.primary")
        self.assertEqual(heading["font_family"], "Inter")

    def test_raises_for_unknown_token_key(self) -> None:
        with self.assertRaises(TokenResolutionError):
            resolve_token(DEFAULT_PLUGIN.token_set, "text.heading.unknown")

    def test_build_render_state_is_runtime_only(self) -> None:
        root = Node(
            id="root",
            kind="document",
            children=[
                Node(
                    id="heading-1",
                    kind="heading",
                    text="Heading",
                    style_tokens=[StyleTokenRef(token="text.heading.primary")],
                )
            ],
        )

        state = build_render_state(DEFAULT_PLUGIN.token_set, root)
        self.assertIn("heading-1", state)
        resolved = resolve_style_tokens(
            DEFAULT_PLUGIN.token_set, root.children[0].style_tokens
        )
        self.assertEqual(state["heading-1"], resolved)


if __name__ == "__main__":
    unittest.main()
