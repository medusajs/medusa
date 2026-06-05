#!/usr/bin/env bash
#
# Closes the issue / PR identified by GITHUB_EVENT_NUMBER. Takes no
# arguments, so a prompt-injection cannot redirect the close to a
# different issue. Always closes with reason "not planned".
#
# Usage:
#   GITHUB_EVENT_NUMBER=N ./scripts/close_issue.sh
#

set -euo pipefail

ISSUE="${GITHUB_EVENT_NUMBER:-}"
if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  echo "Error: GITHUB_EVENT_NUMBER must be a numeric issue/PR number" >&2
  exit 1
fi

if [[ $# -ne 0 ]]; then
  echo "Error: this script takes no arguments. Number is read from GITHUB_EVENT_NUMBER." >&2
  exit 1
fi

gh issue close "$ISSUE" --reason "not planned"
echo "Closed #$ISSUE"
