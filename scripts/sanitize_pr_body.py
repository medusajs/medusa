#!/usr/bin/env python3
#
# Sanitizes a model-written PR body before it is used to open a PR.
#
# Usage:
#   python3 scripts/sanitize_pr_body.py <issue_number|none> < body.md > clean.md
#
# Applies the sanitize_untrusted.py rules, removes every closing-keyword
# reference (so the model cannot close unrelated issues), defuses @mentions,
# drops links and HTML href/src targets not on the Medusa allowlist (keeping
# link text), caps the body at 30000 bytes, then appends `Fixes #<issue_number>`.
# Pass `none` to skip the trailing reference (e.g. Linear-only fixes).
#

import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sanitize_untrusted import neutralize, sanitize_text  # noqa: E402

MAX_BYTES = 30000


def main():
    if len(sys.argv) != 2 or not re.fullmatch(r"[0-9]+|none", sys.argv[1]):
        print("Usage: sanitize_pr_body.py <issue_number|none>", file=sys.stderr)
        return 1
    issue = sys.argv[1]

    body = sys.stdin.buffer.read().decode("utf-8", errors="replace")
    body = sanitize_text(body)
    body = neutralize(body, keep_reference=False)
    body = body.encode("utf-8")[:MAX_BYTES].decode("utf-8", errors="ignore")
    body = body.rstrip()

    if issue != "none":
        body += f"\n\nFixes #{issue}\n"
    elif body:
        body += "\n"

    sys.stdout.buffer.write(body.encode("utf-8"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
