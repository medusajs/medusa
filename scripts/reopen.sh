#!/usr/bin/env bash
#
# Reopens the issue / PR identified by GITHUB_EVENT_NUMBER.
#
# Number target is read only from GITHUB_EVENT_NUMBER, so a prompt-injection
# cannot redirect the reopen to a different issue/PR.
#
# `--workflow` selects which gh subcommand is used: `gh issue reopen` for
# triage and fix (issues), `gh pr reopen` for review and guardrails (PRs).
#
# Usage:
#   GITHUB_EVENT_NUMBER=N ./scripts/reopen.sh --workflow <triage|review|fix|guardrails>
#

set -euo pipefail

WORKFLOW=""

require_value() {
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
  echo "Usage: $0 --workflow <triage|review|fix|guardrails>" >&2
  exit 1
fi

ISSUE="${GITHUB_EVENT_NUMBER:-}"
if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  echo "Error: GITHUB_EVENT_NUMBER must be a numeric issue/PR number" >&2
  exit 1
fi

case "$WORKFLOW" in
  triage|fix)
    gh issue reopen "$ISSUE"
    echo "Reopened issue #$ISSUE"
    ;;
  review|guardrails)
    gh pr reopen "$ISSUE"
    echo "Reopened PR #$ISSUE"
    ;;
  *)
    echo "Error: --workflow must be one of: triage, review, fix, guardrails" >&2
    exit 1
    ;;
esac
