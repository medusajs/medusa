#!/usr/bin/env bash
#
# Prints a file as it is at the PR's head commit, with line numbers. The
# checkout in review jobs is the base branch, so this is the only way to read
# the PR's version of a changed or added file.
# Usage: ./scripts/get_pr_file.sh <pr_number> <path> [start_line end_line]
#
# A file larger than FILE_MAX_BYTES (default 25000) is printed in pages: pass
# start_line and end_line.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PR="${1:-}"
FILE_PATH="${2:-}"
START="${3:-}"
END="${4:-}"

if ! [[ "$PR" =~ ^[0-9]+$ ]] || [[ -z "$FILE_PATH" ]]; then
  echo "Usage: $0 <pr_number> <path> [start_line end_line]" >&2
  exit 1
fi

if [[ "$FILE_PATH" == /* || "/$FILE_PATH/" == *"/../"* || "/$FILE_PATH/" == *"/./"* || "$FILE_PATH" =~ [[:cntrl:]] ]]; then
  echo "Error: path must be relative to the repository root, without . or .. segments" >&2
  exit 1
fi

if [[ -n "$START$END" ]] && ! [[ "$START" =~ ^[1-9][0-9]*$ && "$END" =~ ^[1-9][0-9]*$ && "$START" -le "$END" ]]; then
  echo "Error: start_line and end_line must be positive integers with start_line <= end_line" >&2
  exit 1
fi

REPO="${GITHUB_REPOSITORY:-medusajs/medusa}"
MAX_BYTES="${FILE_MAX_BYTES:-25000}"

HEAD_SHA=$(gh pr view "$PR" --repo "$REPO" --json headRefOid --jq .headRefOid)
ENCODED_PATH=$(python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe="/"))' "$FILE_PATH")

CONTENT=$(mktemp)
trap 'rm -f "$CONTENT"' EXIT

if ! gh api -H "Accept: application/vnd.github.raw" \
  "repos/$REPO/contents/$ENCODED_PATH?ref=$HEAD_SHA" >"$CONTENT" 2>/dev/null; then
  echo "Error: $FILE_PATH does not exist at the head of PR #$PR (deleted, renamed, or a directory)" >&2
  exit 1
fi

# Number before sanitizing: the sanitizer can drop whole lines (multi-line HTML
# comments), and the numbers must still match the file.
number_lines() {
  awk '{ printf "%6d\t%s\n", NR, $0 }' "$CONTENT"
}

SIZE=$(wc -c <"$CONTENT" | tr -d ' ')

if [[ -n "$START" ]]; then
  number_lines | sed -n "${START},${END}p" | python3 "$SCRIPT_DIR/sanitize_untrusted.py"
elif [[ "$SIZE" -gt "$MAX_BYTES" ]]; then
  LINES=$(wc -l <"$CONTENT" | tr -d ' ')
  echo "$FILE_PATH has $LINES lines ($SIZE bytes) at the PR head, too large to read at once."
  echo "Read it in pages of about 400 lines:"
  echo "  bash scripts/get_pr_file.sh $PR $FILE_PATH <start_line> <end_line>"
else
  number_lines | python3 "$SCRIPT_DIR/sanitize_untrusted.py"
fi
