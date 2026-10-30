#!/usr/bin/env bash
#
# Deterministic gate run before any model job: checks an issue or PR for
# hidden content (ANSI escapes, control characters, Unicode tag / zero-width /
# bidi characters, variation selectors) using sanitize_untrusted.py --check.
#
# Usage: ./scripts/check_hidden_content.sh <issue|pr> <number>
#
# Issue: checks the title, body and all comments.
# PR: checks the title, body, comments, review bodies, review comments and
# the diff.
#
# Exits 0 when clean, 3 when hidden content is found. On 3, prints which
# fields contain it (never the content itself). HTML comments are ignored.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SANITIZER="$SCRIPT_DIR/sanitize_untrusted.py"

KIND="${1:-}"
NUMBER="${2:-}"

if [[ "$KIND" != "issue" && "$KIND" != "pr" ]] || ! [[ "$NUMBER" =~ ^[0-9]+$ ]]; then
  echo "Usage: $0 <issue|pr> <number>" >&2
  exit 1
fi

REPO="${GITHUB_REPOSITORY:-medusajs/medusa}"
FOUND=0

# Called with stdin redirected (never at the end of a pipeline) so FOUND and
# `exit` apply to this shell rather than a pipeline subshell.
check_json() {
  local field="$1" status=0
  python3 "$SANITIZER" --json --check || status=$?
  if [[ "$status" -eq 3 ]]; then
    echo "Hidden content found in: $field"
    FOUND=1
  elif [[ "$status" -ne 0 ]]; then
    echo "Error: sanitizer failed on $field" >&2
    exit 1
  fi
}

check_text() {
  local field="$1" status=0
  python3 "$SANITIZER" --check || status=$?
  if [[ "$status" -eq 3 ]]; then
    echo "Hidden content found in: $field"
    FOUND=1
  elif [[ "$status" -ne 0 ]]; then
    echo "Error: sanitizer failed on $field" >&2
    exit 1
  fi
}

check_items() {
  local label="$1" items="$2" count i
  count=$(jq 'length' <<< "$items")
  for ((i = 0; i < count; i++)); do
    check_json "$label $(jq -r --argjson i "$i" '.[$i].ref // ($i | tostring)' <<< "$items")" \
      < <(jq --argjson i "$i" '.[$i].body // ""' <<< "$items")
  done
}

if [[ "$KIND" == "issue" ]]; then
  DATA=$(gh issue view "$NUMBER" --repo "$REPO" --json title,body,comments)
  check_json "issue title" < <(jq '.title' <<< "$DATA")
  check_json "issue body" < <(jq '.body // ""' <<< "$DATA")
  check_items "issue comment" "$(jq '[.comments[] | {body, ref: .url}]' <<< "$DATA")"
else
  DATA=$(gh pr view "$NUMBER" --repo "$REPO" --json title,body,comments,reviews)
  check_json "PR title" < <(jq '.title' <<< "$DATA")
  check_json "PR body" < <(jq '.body // ""' <<< "$DATA")
  check_items "PR comment" "$(jq '[.comments[] | {body, ref: .url}]' <<< "$DATA")"
  check_items "PR review" "$(jq '[.reviews[] | {body, ref: .id}]' <<< "$DATA")"
  REVIEW_COMMENTS=$(gh api "repos/$REPO/pulls/$NUMBER/comments" --paginate \
    --jq '.[] | {body, ref: .html_url}' | jq -s '.')
  check_items "PR review comment" "$REVIEW_COMMENTS"
  # GitHub refuses the diff of a PR with over 300 files; fall back to the
  # per-file patches, which omit binary and very large files.
  DIFF=$(gh pr diff "$NUMBER" --repo "$REPO") \
    || DIFF=$(gh api "repos/$REPO/pulls/$NUMBER/files" --paginate --jq '.[] | .patch // empty')
  check_text "PR diff" <<< "$DIFF"
fi

if [[ "$FOUND" -eq 1 ]]; then
  exit 3
fi
echo "No hidden content found in $KIND #$NUMBER"
