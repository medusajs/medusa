#!/usr/bin/env python3
#
# Removes hidden-content vectors from untrusted text (issue / PR titles,
# bodies, comments, diffs) before it reaches a model or a rendered surface.
#
# Usage:
#   python3 scripts/sanitize_untrusted.py [--json] [--check] [--report FILE]
#
#   (default)      stdin text -> stdout sanitized text.
#   --json         stdin is JSON (one value, or a stream of concatenated
#                  values such as `gh --jq` output); every string value and
#                  key is sanitized recursively. Streams are emitted one
#                  compact value per line.
#   --report FILE  also write {"hidden": N, "smuggling": N, "html_comments": N,
#                  "kinds": [...]} to FILE. `hidden` excludes HTML comments;
#                  `smuggling` is the subset that fails --check.
#   --check        print nothing; exit 3 when smuggling content is present,
#                  else exit 0. Smuggling = tag characters, bidi controls,
#                  stray variation selectors, and ANSI sequences other than
#                  plain foreground colors (concealment, background colors,
#                  cursor / erase codes, OSC). Pasted-log colors, stray
#                  zero-width spaces, controls and HTML comments are still
#                  removed but don't fail the check.
#
# Removed: ANSI / VT escape sequences (CSI, OSC, DCS/SOS/PM/APC, other ESC
# sequences), C0 controls except \n and \t, DEL, C1 controls, Unicode tag
# characters, zero-width / invisible format characters, bidi controls,
# variation selectors, and HTML comments (unterminated ones to end of text).
#
# CRLF and lone CR are normalized to LF and are not counted as hidden, since
# GitHub stores most issue bodies with CRLF line endings. A single U+FE0F
# after a symbol and a U+200D joining two symbols are kept so ordinary emoji
# (heart + U+FE0F, ZWJ sequences) survive; runs of them are still removed.
#
# The module also exposes helpers used by add_comment.sh and
# sanitize_pr_body.py to neutralize links, @mentions and closing keywords.
#

import argparse
import html
import json
import posixpath
import re
import sys
import unicodedata
from urllib.parse import unquote, urlsplit

ANSI_RE = re.compile(
    r"\x1b\][^\x07\x1b]*(?:\x07|\x1b\\|\Z)"
    r"|\x1b[PX^_][^\x1b]*(?:\x1b\\|\Z)"
    r"|\x1b\[[0-?]*[ -/]*[@-~]"
    r"|\x1b[ -/]*[0-~]"
    r"|\x1b"
    r"|\x9d[^\x07\x9c\x1b]*(?:\x07|\x9c|\x1b\\|\Z)"
    r"|\x9b[0-?]*[ -/]*[@-~]"
)

INVISIBLE_RE = re.compile(
    "[\x00-\x08\x0b-\x1f\x7f-\x9f"
    "\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u2069"
    "\ufe00-\ufe0f\ufeff"
    "\U000e0000-\U000e007f\U000e0100-\U000e01ef]"
)

HTML_COMMENT_RE = re.compile(r"<!--.*?(?:-->|\Z)", re.S)

SGR_RE = re.compile(r"\x1b\[([0-9;]*)m")

SMUGGLING_KINDS = {"tag", "bidi", "variation_selector"}

ZWJ = "\u200d"
VS16 = "\ufe0f"
KEYCAP = "\u20e3"


def _kind(ch):
    cp = ord(ch)
    if cp < 0x20 or cp == 0x7F:
        return "control"
    if cp <= 0x9F:
        return "c1"
    if 0xE0000 <= cp <= 0xE007F:
        return "tag"
    if 0xFE00 <= cp <= 0xFE0F or 0xE0100 <= cp <= 0xE01EF:
        return "variation_selector"
    if cp == 0x061C or 0x202A <= cp <= 0x202E or 0x2066 <= cp <= 0x2069:
        return "bidi"
    return "zero_width"


def _is_plain_color(seq):
    match = SGR_RE.fullmatch(seq)
    if not match:
        return False
    for param in filter(None, match.group(1).split(";")):
        code = int(param)
        if code == 8 or 40 <= code <= 49 or 100 <= code <= 107:
            return False
    return True


def _is_symbol(ch):
    return unicodedata.category(ch) == "So" or 0x1F3FB <= ord(ch) <= 0x1F3FF


def _is_emoji_part(text, pos):
    ch = text[pos]
    prev = text[pos - 1] if pos > 0 else ""
    nxt = text[pos + 1] if pos + 1 < len(text) else ""
    if ch == VS16:
        return bool(prev) and (
            _is_symbol(prev) or (prev in "0123456789#*" and nxt == KEYCAP)
        )
    if ch == ZWJ:
        before = text[pos - 2] if prev == VS16 and pos > 1 else prev
        return bool(before) and bool(nxt) and _is_symbol(before) and _is_symbol(nxt)
    return False


class Report:
    def __init__(self):
        self.hidden = 0
        self.smuggling = 0
        self.html_comments = 0
        self.kinds = set()

    def as_dict(self):
        return {
            "hidden": self.hidden,
            "smuggling": self.smuggling,
            "html_comments": self.html_comments,
            "kinds": sorted(self.kinds),
        }


def sanitize_text(text, report=None):
    if report is None:
        report = Report()
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    def drop_ansi(match):
        report.hidden += 1
        if _is_plain_color(match.group(0)):
            report.kinds.add("ansi_color")
        else:
            report.smuggling += 1
            report.kinds.add("ansi")
        return ""

    text = ANSI_RE.sub(drop_ansi, text)

    def drop_invisible(match):
        pos = match.start()
        if _is_emoji_part(match.string, pos):
            return match.group(0)
        kind = _kind(match.group(0))
        report.hidden += 1
        report.kinds.add(kind)
        if kind in SMUGGLING_KINDS:
            report.smuggling += 1
        return ""

    text = INVISIBLE_RE.sub(drop_invisible, text)

    def drop_comment(match):
        report.html_comments += 1
        report.kinds.add("html_comment")
        return ""

    return HTML_COMMENT_RE.sub(drop_comment, text)


def sanitize_value(value, report):
    if isinstance(value, str):
        return sanitize_text(value, report)
    if isinstance(value, list):
        return [sanitize_value(v, report) for v in value]
    if isinstance(value, dict):
        return {
            sanitize_text(k, report): sanitize_value(v, report)
            for k, v in value.items()
        }
    return value


def _iter_json_values(raw):
    decoder = json.JSONDecoder()
    pos = 0
    length = len(raw)
    while True:
        while pos < length and raw[pos] in " \t\r\n":
            pos += 1
        if pos >= length:
            return
        value, pos = decoder.raw_decode(raw, pos)
        yield value


ALLOWED_HOSTS = {"docs.medusajs.com", "medusajs.com", "www.medusajs.com"}

MD_DEST = r"(?:<([^<>\n]*)>|([^()\s<>]*(?:\([^()\s]*\)[^()\s<>]*)*))"
MD_TITLE = r"(?:\s+(?:\"[^\"]*\"|'[^']*'|\([^()]*\)))?"
MD_LINK_RE = re.compile(r"!?\[([^\[\]]*)\]\(\s*" + MD_DEST + MD_TITLE + r"\s*\)")
MD_DEST_RE = re.compile(r"\]\(\s*" + MD_DEST + MD_TITLE + r"\s*\)")
MD_REF_DEF_RE = re.compile(r"(?m)^[ ]{0,3}\[[^\]]+\]:[ \t]*<?(\S+?)>?(?:[ \t]+.*)?$")
AUTOLINK_RE = re.compile(r"<([a-zA-Z][a-zA-Z0-9+.-]*:[^\s<>]*)>")
BARE_URL_RE = re.compile(r"(?i)\b(?:https?://|www\.)[^\s<>()\[\]\"'`]+")
HTML_TAG_RE = re.compile(r"<[a-zA-Z][^<>]*>")
URL_ATTR_RE = re.compile(
    r"(?i)\s(?:href|src|srcset|action|formaction|poster|background|cite|data|xlink:href)"
    r"\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)"
)
MENTION_RE = re.compile(r"(?<![A-Za-z0-9])@(?=[A-Za-z0-9])")
CLOSING_RE = re.compile(
    r"(?i)\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)[^\w\n#]{0,20}(?:\[[^\]\n]*\]\(\s*<?)?"
    r"((?:[\w.-]+/[\w.-]+)?#\d+|https?://github\.com/[\w.-]+/[\w.-]+/(?:issues|pull)/\d+)"
)


def is_allowed_url(url):
    candidate = html.unescape(url).strip()
    if any(ch == "\\" or ch.isspace() or ord(ch) < 0x20 for ch in candidate):
        return False
    if candidate.lower().startswith("www."):
        candidate = "https://" + candidate
    try:
        parts = urlsplit(candidate)
        host = (parts.hostname or "").lower()
    except ValueError:
        return False
    if parts.scheme.lower() not in ("http", "https") or parts.username or parts.password:
        return False
    path = unquote(parts.path)
    if "%" in path or any(seg in (".", "..") for seg in path.split("/")):
        return False
    if host in ALLOWED_HOSTS:
        return True
    return host == "github.com" and posixpath.normpath(path).lower().startswith("/medusajs/")


def _strip_html_url_attrs(match):
    def attr(m):
        value = m.group(1).strip("\"'")
        if m.group(0).lower().lstrip().startswith("srcset") or not is_allowed_url(value):
            return ""
        return m.group(0)

    return URL_ATTR_RE.sub(attr, match.group(0))


def strip_links(text):
    text = MD_LINK_RE.sub(
        lambda m: m.group(0) if is_allowed_url(m.group(2) or m.group(3) or "") else m.group(1),
        text,
    )
    text = MD_DEST_RE.sub(
        lambda m: m.group(0) if is_allowed_url(m.group(1) or m.group(2) or "") else "]",
        text,
    )
    text = MD_REF_DEF_RE.sub(
        lambda m: m.group(0) if is_allowed_url(m.group(1)) else "", text
    )
    text = AUTOLINK_RE.sub(
        lambda m: m.group(0) if is_allowed_url(m.group(1)) else "", text
    )
    text = HTML_TAG_RE.sub(_strip_html_url_attrs, text)
    return BARE_URL_RE.sub(
        lambda m: m.group(0) if is_allowed_url(m.group(0)) else "", text
    )


def defuse_mentions(text):
    return MENTION_RE.sub("", text)


def strip_closing_keywords(text, keep_reference=True):
    return CLOSING_RE.sub(lambda m: m.group(1) if keep_reference else "", text)


def neutralize(text, keep_reference=True):
    # Closing keywords run last: stripping a link can leave `Fixes #12` behind.
    text = strip_links(text)
    text = defuse_mentions(text)
    return strip_closing_keywords(text, keep_reference)


FENCE_RE = re.compile(r"^ {0,3}(`{3,}|~{3,})[ \t]*([A-Za-z0-9_+-]{0,20})[ \t]*$")
INLINE_CODE_RE = re.compile(r"`([^`\n]+)`")


def _escape_html(text):
    # `&` first so existing entities like `&lt;` stay literal text.
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _render_prose(text):
    parts = []
    last = 0
    for match in INLINE_CODE_RE.finditer(text):
        parts.append(_escape_html(neutralize(text[last:match.start()].replace("`", ""))))
        parts.append("`" + match.group(1) + "`")
        last = match.end()
    parts.append(_escape_html(neutralize(text[last:].replace("`", ""))))
    return "".join(parts)


def render_markdown_param(text):
    """Sanitizes model-written markdown for a comment, keeping code intact.

    Prose gets links, mentions and closing keywords neutralized and HTML
    escaped. Fenced blocks and inline code spans are kept verbatim (GitHub
    renders neither links, mentions nor HTML inside them); fences are
    normalized and an unterminated fence is closed.
    """
    text = sanitize_text(text)
    out = []
    prose = []
    fence = None
    for line in text.split("\n"):
        match = FENCE_RE.match(line)
        if fence is None:
            if match:
                if prose:
                    out.append(_render_prose("\n".join(prose)))
                    prose = []
                fence = match.group(1)
                out.append("```" + match.group(2))
            else:
                prose.append(line)
        elif match and match.group(1)[0] == fence[0] and len(match.group(1)) >= len(fence) and not match.group(2):
            out.append("```")
            fence = None
        else:
            out.append(line)
    if prose:
        out.append(_render_prose("\n".join(prose)))
    if fence is not None:
        out.append("```")
    return "\n".join(out)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--report")
    args = parser.parse_args()

    raw = sys.stdin.buffer.read().decode("utf-8", errors="replace")
    report = Report()

    if args.json:
        try:
            values = [sanitize_value(v, report) for v in _iter_json_values(raw)]
        except json.JSONDecodeError as err:
            print(f"Error: invalid JSON on stdin: {err}", file=sys.stderr)
            return 1
        output = "".join(
            json.dumps(v, ensure_ascii=False) + "\n" for v in values
        )
    else:
        output = sanitize_text(raw, report)

    if args.report:
        with open(args.report, "w", encoding="utf-8") as f:
            json.dump(report.as_dict(), f)

    if args.check:
        return 3 if report.smuggling else 0

    sys.stdout.buffer.write(output.encode("utf-8"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
