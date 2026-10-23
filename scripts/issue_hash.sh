#!/usr/bin/env bash
#
# Prints the sha256 hex digest of a GitHub issue's sanitized content:
# sanitized(title) + "\n" + sanitized(body), using sanitize_untrusted.py.
#
# Usage: ./scripts/issue_hash.sh <issue_number>
#
# Triage computes it from the same data the model saw and passes it to
# fix-issue.yml, which recomputes it and refuses to run if the issue was
# edited after triage.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -z "${1:-}" ]] || ! [[ "$1" =~ ^[0-9]+$ ]]; then
  echo "Usage: $0 <issue_number>" >&2
  exit 1
fi

ISSUE="$1"
REPO="${GITHUB_REPOSITORY:-medusajs/medusa}"

gh issue view "$ISSUE" --repo "$REPO" --json title,body \
  | SCRIPT_DIR="$SCRIPT_DIR" python3 -c '
import hashlib, json, os, sys
sys.path.insert(0, os.environ["SCRIPT_DIR"])
from sanitize_untrusted import sanitize_text

issue = json.load(sys.stdin)
content = sanitize_text(issue.get("title") or "") + "\n" + sanitize_text(issue.get("body") or "")
print(hashlib.sha256(content.encode("utf-8")).hexdigest())
'
