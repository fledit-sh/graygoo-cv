from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(frozen=True, slots=True)
class AppSettings:
    external_design_package_paths: tuple[str, ...] = ()

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "AppSettings":
        raw_paths = payload.get("external_design_package_paths", [])
        if not isinstance(raw_paths, list):
            return cls()

        normalized = tuple(str(path) for path in raw_paths if isinstance(path, str) and path.strip())
        return cls(external_design_package_paths=normalized)


def load_app_settings(path: str | Path | None) -> AppSettings:
    if path is None:
        return AppSettings()

    settings_path = Path(path)
    if not settings_path.exists():
        return AppSettings()

    try:
        payload = json.loads(settings_path.read_text(encoding="utf-8"))
    except Exception:
        return AppSettings()

    if not isinstance(payload, dict):
        return AppSettings()

    return AppSettings.from_dict(payload)
