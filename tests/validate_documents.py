#!/usr/bin/env python3
"""Validate JSON/YAML manifests and local Markdown links in the skill package."""

from __future__ import annotations

import json
import pathlib
import re
import sys

import yaml


ROOTS = [
    pathlib.Path("README.md"),
    pathlib.Path("CHANGELOG.md"),
    pathlib.Path("docs"),
    pathlib.Path("design-designer"),
    pathlib.Path("design-coder"),
    pathlib.Path("design-auditor"),
    pathlib.Path("token-writer"),
]


def iter_files() -> list[pathlib.Path]:
    files: list[pathlib.Path] = []
    for root in ROOTS:
        if root.is_file():
            files.append(root)
        elif root.is_dir():
            files.extend(path for path in root.rglob("*") if path.is_file())
    return files


def main() -> int:
    problems: list[str] = []
    for path in iter_files():
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        if path.suffix == ".json":
            try:
                json.loads(text)
            except Exception as exc:  # pragma: no cover - diagnostic path
                problems.append(f"JSON {path}: {exc}")
        elif path.suffix in {".yaml", ".yml"}:
            try:
                yaml.safe_load(text)
            except Exception as exc:  # pragma: no cover - diagnostic path
                problems.append(f"YAML {path}: {exc}")
        elif path.suffix == ".md":
            for match in re.finditer(r"\[[^\]]*\]\(([^)]+)\)", text):
                raw = match.group(1).strip("<>")
                if raw.startswith(("http://", "https://", "#", "mailto:")):
                    continue
                target = raw.split("#", 1)[0]
                if target and not (path.parent / target).exists():
                    problems.append(f"LINK {path}: {raw}")

    if problems:
        print("\n".join(problems))
        return 1
    print("PASS: JSON, YAML, and local Markdown links")
    return 0


if __name__ == "__main__":
    sys.exit(main())
