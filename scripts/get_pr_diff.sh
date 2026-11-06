#!/usr/bin/env bash
#
# Fetches the unified diff for a PR, whole or for one file.
# Usage: ./scripts/get_pr_diff.sh [pr_number] [path [start_line end_line]]
#
# If pr_number is not provided, reads from the workflow event payload.
#
# Without a path, prints the full diff. When the diff is larger than
# DIFF_MAX_BYTES (default 25000) or GitHub refuses it (over 300 files), prints
# the changed files instead so the caller can fetch them one at a time.
#
# With a path, prints that file's patch. A patch larger than DIFF_MAX_BYTES is
# printed in pages: pass start_line and end_line (lines of the patch).
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -n "${1:-}" ]]; then
  PR="$1"
else
  PR=$(jq -r '.pull_request.number // empty' "${GITHUB_EVENT_PATH:?GITHUB_EVENT_PATH not set}")
fi

if ! [[ "$PR" =~ ^[0-9]+$ ]]; then
  echo "Error: no valid PR number provided or found in event payload" >&2
  exit 1
fi

FILE_PATH="${2:-}"
START="${3:-}"
END="${4:-}"

if [[ -n "$START$END" ]] && ! [[ "$START" =~ ^[1-9][0-9]*$ && "$END" =~ ^[1-9][0-9]*$ && "$START" -le "$END" ]]; then
  echo "Error: start_line and end_line must be positive integers with start_line <= end_line" >&2
  exit 1
fi

REPO="${GITHUB_REPOSITORY:-medusajs/medusa}"
MAX_BYTES="${DIFF_MAX_BYTES:-25000}"

if [[ -z "$FILE_PATH" ]]; then
  ERR=$(mktemp)
  trap 'rm -f "$ERR"' EXIT
  if ! DIFF=$(gh pr diff "$PR" --repo "$REPO" 2>"$ERR"); then
    if ! grep -qE "too_large|HTTP 406" "$ERR"; then
      cat "$ERR" >&2
      exit 1
    fi
    REASON="GitHub refuses to serve the full diff for this PR (over 300 files)"
  elif [[ "${#DIFF}" -gt "$MAX_BYTES" ]]; then
    REASON="The full diff is ${#DIFF} bytes, too large to read at once"
  else
    printf '%s\n' "$DIFF" | python3 "$SCRIPT_DIR/sanitize_untrusted.py"
    exit 0
  fi
  echo "$REASON. Fetch each file's patch with:"
  echo "  bash scripts/get_pr_diff.sh $PR <path>"
  echo
  echo "Changed files (status, lines added/removed, path):"
  gh api "repos/$REPO/pulls/$PR/files" --paginate \
    --jq '.[] | "\(.status)\t+\(.additions) -\(.deletions)\t\(.filename)"' \
    | python3 "$SCRIPT_DIR/sanitize_untrusted.py"
  exit 0
fi

ENTRY=$(gh api "repos/$REPO/pulls/$PR/files" --paginate --jq '.[]' \
  | jq -c --arg p "$FILE_PATH" 'select(.filename == $p)' | head -n 1)

if [[ -z "$ENTRY" ]]; then
  echo "Error: $FILE_PATH is not changed in PR #$PR. Run get_pr_files.sh for the list." >&2
  exit 1
fi

PATCH=$(jq -r '
  "diff --git a/\(.previous_filename // .filename) b/\(.filename)\nstatus: \(.status)\n"
  + (.patch // "(no patch: binary, or too large for GitHub to render. Read the file with get_pr_file.sh)")
' <<<"$ENTRY")

if [[ -n "$START" ]]; then
  printf '%s\n' "$PATCH" | sed -n "${START},${END}p" | python3 "$SCRIPT_DIR/sanitize_untrusted.py"
elif [[ "${#PATCH}" -gt "$MAX_BYTES" ]]; then
  LINES=$(printf '%s\n' "$PATCH" | wc -l | tr -d ' ')
  echo "The patch for $FILE_PATH has $LINES lines (${#PATCH} bytes), too large to read at once."
  echo "Read it in pages of about 400 lines, starting each page at a @@ hunk header where possible:"
  echo "  bash scripts/get_pr_diff.sh $PR $FILE_PATH <start_line> <end_line>"
else
  printf '%s\n' "$PATCH" | python3 "$SCRIPT_DIR/sanitize_untrusted.py"
fi
