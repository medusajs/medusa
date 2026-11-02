#!/usr/bin/env bash
#
# Fetches PR details (title, body, author, state, diff stats, labels).
# Usage: ./scripts/get_pr.sh [pr_number]
#
# If pr_number is not provided, reads from the workflow event payload.
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

REPO="${GITHUB_REPOSITORY:-medusajs/medusa}"

gh pr view "$PR" --repo "$REPO" --json number,title,body,author,state,labels,additions,deletions,changedFiles,baseRefName,isDraft,url \
  | python3 "$SCRIPT_DIR/sanitize_untrusted.py" --json
