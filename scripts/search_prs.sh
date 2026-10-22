#!/usr/bin/env bash
#
# Finds OPEN pull requests that reference a given issue in their body,
# e.g. "closes #123", "related to #123", or a bare "#123" mention, or a
# Linear ticket ID such as "DX-1234". This
# catches PRs that mention an issue without formally linking it via a
# closing keyword. Read-only.
#
# Usage: ./scripts/search_prs.sh <issue_number | LINEAR-ID>
#
# GitHub's search index tokenizes numbers, so a text search for "#123"
# also matches PRs that merely contain the number 123 in an unrelated
# context (a port, a timeout, a byte count). To avoid those false
# positives we post-filter the search hits with a word-boundary regex,
# keeping only PRs whose body contains a real "#123" reference.
#
# Returns a JSON array of matching PRs (number, title, state, url,
# createdAt), or [] if none found.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${1:-}" =~ ^[0-9]+$ ]]; then
  export TERM_TEXT="#$1"
elif [[ "${1:-}" =~ ^[A-Z]{2,10}-[0-9]{1,7}$ ]]; then
  export TERM_TEXT="$1"
else
  echo "Usage: $0 <issue_number | LINEAR-ID>" >&2
  exit 1
fi

REPO="${GITHUB_REPOSITORY:-medusajs/medusa}"

# The reference followed by a non-digit or end-of-string, so searching #123
# does not match #1234. `.body` may be null on some PRs — coalesce first.
gh search prs "$TERM_TEXT" \
  --repo "$REPO" \
  --state open \
  --match body \
  --limit 30 \
  --json number,title,state,url,createdAt,body \
  --jq '[ .[] | select((.body // "") | test(env.TERM_TEXT + "(\\D|$)")) | {number, title, state, url, createdAt} ]' \
  | python3 "$SCRIPT_DIR/sanitize_untrusted.py" --json
