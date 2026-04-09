#!/usr/bin/env bash
#
# Fetches the current labels on a GitHub issue.
# Usage: ./scripts/get_labels.sh [issue_number]
#
# If issue_number is not provided, reads from the workflow event payload.
#

set -euo pipefail

if [[ -n "${1:-}" ]]; then
  ISSUE="$1"
else
  ISSUE=$(jq -r '.issue.number // empty' "${GITHUB_EVENT_PATH:?GITHUB_EVENT_PATH not set}")
fi

if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  echo "Error: no valid issue number provided or found in event payload" >&2
  exit 1
fi

gh issue view "$ISSUE" --json labels --jq '[.labels[].name]'
