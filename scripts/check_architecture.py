from __future__ import annotations

import ast
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

RULES = {
    "core": {
        "forbidden": ("PySide6", "application", "presentation"),
        "message": "core layer must stay framework-free and only depend on core",
    },
    "application": {
        "forbidden": ("PySide6", "presentation"),
        "message": "application layer must not depend on UI layer or PySide6",
    },
}


def iter_python_files(layer: str) -> list[Path]:
    return sorted((ROOT / layer).rglob("*.py"))


def imported_modules(path: Path) -> set[str]:
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    modules: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                modules.add(alias.name)
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                modules.add(node.module)
    return modules


def check_layer(layer: str) -> list[str]:
    failures: list[str] = []
    forbidden = RULES[layer]["forbidden"]
    message = RULES[layer]["message"]
    for path in iter_python_files(layer):
        modules = imported_modules(path)
        for module in modules:
            if any(module == prefix or module.startswith(f"{prefix}.") for prefix in forbidden):
                rel = path.relative_to(ROOT)
                failures.append(f"{rel}: forbidden import '{module}' ({message})")
    return failures


def main() -> int:
    failures: list[str] = []
    for layer in RULES:
        failures.extend(check_layer(layer))

    if failures:
        print("Architecture import checks failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Architecture import checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
