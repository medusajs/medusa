#!/usr/bin/env bash
#
# Fetches issues linked in a PR body via closing keywords (closes/fixes/resolves #<number>).
# Usage: ./scripts/get_linked_issues.sh [pr_number]
#
# If pr_number is not provided, reads from the workflow event payload.
# Returns a JSON array of linked issue objects, or [] if none found.
#

set -euo pipefail

if [[ -n "${1:-}" ]]; then
  PR="$1"
else
  PR=$(jq -r '.pull_request.number // empty' "${GITHUB_EVENT_PATH:?GITHUB_EVENT_PATH not set}")
fi

if ! [[ "$PR" =~ ^[0-9]+$ ]]; then
  echo "Error: no valid PR number provided or found in event payload" >&2
  exit 1
fi

# Fetch PR body
BODY=$(gh pr view "$PR" --json body --jq '.body // ""')

# Extract issue numbers referenced by closing keywords (case-insensitive)
ISSUE_NUMBERS=$(echo "$BODY" | grep -oiE '(closes|fixes|resolves)[[:space:]]+#[0-9]+' | grep -oE '[0-9]+' || true)

if [[ -z "$ISSUE_NUMBERS" ]]; then
  echo "[]"
  exit 0
fi

# Fetch details for each linked issue
RESULTS="["
FIRST=true
while IFS= read -r NUM; do
  ISSUE_DATA=$(gh issue view "$NUM" --json number,title,labels,state,url 2>/dev/null || echo "")
  if [[ -n "$ISSUE_DATA" ]]; then
    if [[ "$FIRST" == "false" ]]; then
      RESULTS+=","
    fi
    RESULTS+="$ISSUE_DATA"
    FIRST=false
  fi
done <<< "$ISSUE_NUMBERS"
RESULTS+="]"

echo "$RESULTS"
