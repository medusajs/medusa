#!/usr/bin/env bash
#
# Manages labels on a GitHub issue.
# Usage: ./scripts/labels.sh [issue_number] <action> <label>
#
# action: add | remove
#
# If issue_number is not provided as first arg, reads from the workflow event payload.
# Examples:
#   ./scripts/labels.sh 123 add bug
#   ./scripts/labels.sh 123 remove needs-triage
#   ./scripts/labels.sh add bug          (issue from event payload)
#

set -euo pipefail

# Detect whether first arg is an issue number or an action
if [[ $# -eq 3 ]]; then
  ISSUE="$1"
  ACTION="$2"
  LABEL="$3"
elif [[ $# -eq 2 ]]; then
  ISSUE=$(jq -r '.issue.number // empty' "${GITHUB_EVENT_PATH:?GITHUB_EVENT_PATH not set}")
  ACTION="$1"
  LABEL="$2"
else
  echo "Usage: $0 [issue_number] <add|remove> <label>" >&2
  exit 1
fi

if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  echo "Error: no valid issue number provided or found in event payload" >&2
  exit 1
fi

case "$ACTION" in
  add|remove) ;;
  *)
    echo "Error: action must be 'add' or 'remove', got '$ACTION'" >&2
    exit 1
    ;;
esac

# Verify the label exists in the repo
VALID_LABELS=$(gh label list --limit 500 --json name --jq '.[].name')
if ! echo "$VALID_LABELS" | grep -qxF "$LABEL"; then
  echo "Warning: label '$LABEL' does not exist in the repo, skipping" >&2
  exit 0
fi

if [[ "$ACTION" == "add" ]]; then
  gh issue edit "$ISSUE" --add-label "$LABEL"
  echo "Added label '$LABEL' to issue #$ISSUE"
else
  gh issue edit "$ISSUE" --remove-label "$LABEL"
  echo "Removed label '$LABEL' from issue #$ISSUE"
fi
