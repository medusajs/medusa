#!/usr/bin/env bash
#
# Fetches the unified diff for a PR.
# Usage: ./scripts/get_pr_diff.sh [pr_number]
#
# If pr_number is not provided, reads from the workflow event payload.
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

gh pr diff "$PR"
