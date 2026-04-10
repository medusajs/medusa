#!/usr/bin/env bash
#
# Posts a comment on a GitHub issue.
# Usage: ./scripts/add_comment.sh [issue_number] <body>
#
# If issue_number is not provided as first arg (i.e. only one argument is given),
# the issue number is read from the workflow event payload and the single arg is the body.
#

set -euo pipefail

if [[ $# -eq 2 ]]; then
  ISSUE="$1"
  BODY="$2"
elif [[ $# -eq 1 ]]; then
  ISSUE=$(jq -r '.issue.number // empty' "${GITHUB_EVENT_PATH:?GITHUB_EVENT_PATH not set}")
  BODY="$1"
else
  echo "Usage: $0 [issue_number] <body>" >&2
  exit 1
fi

if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  echo "Error: no valid issue number provided or found in event payload" >&2
  exit 1
fi

gh issue comment "$ISSUE" --body "$BODY"
echo "Comment posted on issue #$ISSUE"
