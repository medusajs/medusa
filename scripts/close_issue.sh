#!/usr/bin/env bash
#
# Closes the issue / PR identified by GITHUB_EVENT_NUMBER.
#
# Number target is read only from GITHUB_EVENT_NUMBER, so a prompt-injection
# cannot redirect the close to a different issue/PR.
#
# `--workflow` selects which gh subcommand is used: `gh issue close` for
# triage (issues), `gh pr close` for review (PRs). `gh issue close` does
# not work on PRs, so this distinction matters.
#
# Issues are closed with reason "not planned".
#
# Usage:
#   GITHUB_EVENT_NUMBER=N ./scripts/close_issue.sh --workflow <triage|review>
#

set -euo pipefail

WORKFLOW=""

require_value() {
  # Treat a missing arg, an empty string, or a next token that looks
  # like another flag (`--foo`) as a missing value so the failure points
  # at the right argument.
  if [[ $# -lt 2 || -z "${2:-}" || "$2" == --* ]]; then
    echo "Error: $1 requires a value" >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --workflow) require_value "$@"; WORKFLOW="$2"; shift 2 ;;
    *)
      echo "Error: unknown argument '$1'" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$WORKFLOW" ]]; then
  echo "Usage: $0 --workflow <triage|review>" >&2
  exit 1
fi

ISSUE="${GITHUB_EVENT_NUMBER:-}"
if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  echo "Error: GITHUB_EVENT_NUMBER must be a numeric issue/PR number" >&2
  exit 1
fi

case "$WORKFLOW" in
  triage)
    gh issue close "$ISSUE" --reason "not planned"
    echo "Closed issue #$ISSUE"
    ;;
  review)
    gh pr close "$ISSUE"
    echo "Closed PR #$ISSUE"
    ;;
  *)
    echo "Error: --workflow must be 'triage' or 'review'" >&2
    exit 1
    ;;
esac
