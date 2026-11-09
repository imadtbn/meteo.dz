#!/usr/bin/env python3
"""Validate generated local links and assets for the GitHub Pages site."""
from __future__ import annotations

import os
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SKIP_SCHEMES = {"http", "https", "mailto", "tel", "data", "javascript", "blob"}


class ReferenceParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.references: list[tuple[str, str]] = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for attr in ("href", "src", "poster", "action"):
            value = attrs.get(attr)
            if value:
                self.references.append((value.strip(), f"<{tag} {attr}>"))
        srcset = attrs.get("srcset")
        if srcset:
            for item in srcset.split(","):
                candidate = item.strip().split()
                if candidate:
                    self.references.append((candidate[0], f"<{tag} srcset>"))


def local_target(source: Path, raw_url: str) -> Path | None:
    value = raw_url.strip()
    if not value or value.startswith("#"):
        return None
    parsed = urlsplit(value)
    if parsed.scheme.lower() in SKIP_SCHEMES or parsed.netloc:
        return None
    path = unquote(parsed.path)
    if not path:
        return None
    target = ROOT / path.lstrip("/") if path.startswith("/") else source.parent / path
    target = Path(os.path.normpath(str(target)))
    try:
        target.relative_to(ROOT)
    except ValueError:
        return target
    if target.is_dir():
        target = target / "index.html"
    elif not target.suffix and (target / "index.html").is_file():
        target = target / "index.html"
    return target


def check_html() -> list[str]:
    errors: list[str] = []
    for page in sorted(ROOT.rglob("*.html")):
        if page.name.endswith(".template.html"):\n            continue\n        if any(part in {".git", "node_modules"} for part in page.parts):
            continue
        parser = ReferenceParser()
        try:
            parser.feed(page.read_text(encoding="utf-8"))
        except (OSError, UnicodeError) as exc:
            errors.append(f"{page.relative_to(ROOT)}: cannot read HTML: {exc}")
            continue
        for raw_url, context in parser.references:
            target = local_target(page, raw_url)
            if target is not None and not target.is_file():
                display = target.relative_to(ROOT) if target.is_relative_to(ROOT) else target
                errors.append(f"{page.relative_to(ROOT)}: missing {context} target {raw_url!r} -> {display}")
    return errors


def check_css() -> list[str]:
    errors: list[str] = []
    pattern = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.IGNORECASE)
    for css in sorted((ROOT / "assets").rglob("*.css")):
        content = css.read_text(encoding="utf-8")
        for match in pattern.finditer(content):
            raw_url = match.group(2).strip()
            if not raw_url or raw_url.startswith("#"):
                continue
            target = local_target(css, raw_url)
            if target is not None and not target.is_file():
                errors.append(f"{css.relative_to(ROOT)}: missing CSS asset {raw_url!r}")
    return errors


def check_service_worker_assets() -> list[str]:
    worker = ROOT / "service-worker.js"
    content = worker.read_text(encoding="utf-8")
    match = re.search(r"const\s+STATIC_ASSETS\s*=\s*\[(.*?)\];", content, re.S)
    if not match:
        return ["service-worker.js: STATIC_ASSETS array was not found"]
    errors = []
    for raw in re.findall(r"['\"]([^'\"]+)['\"]", match.group(1)):
        parsed = urlsplit(raw)
        if parsed.scheme or parsed.netloc:
            continue
        path = unquote(parsed.path)
        target = ROOT / path.lstrip("/") if path.startswith("/") else ROOT / path.removeprefix("./")
        if target.is_dir():
            target = target / "index.html"
        if not target.is_file():
            errors.append(f"service-worker.js: precache asset does not exist: {raw}")
    return errors


def main() -> int:
    errors = check_html() + check_css() + check_service_worker_assets()
    if errors:
        print(f"Site integrity check failed: {len(errors)} issue(s)")
        for error in errors:
            print(f" - {error}")
        return 1
    html_count = sum(1 for _ in ROOT.rglob("*.html"))
    css_count = sum(1 for _ in (ROOT / "assets").rglob("*.css"))
    print(f"Site integrity check passed: {html_count} HTML pages and {css_count} CSS files checked.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
