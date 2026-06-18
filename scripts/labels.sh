#!/usr/bin/env bash
#
# Manages labels on a GitHub issue / PR with a hardcoded allowlist.
#
# Usage:
#   GITHUB_EVENT_NUMBER=123 ./scripts/labels.sh \
#       --workflow <triage|review> \
#       --action <add|remove> \
#       --label <label>
#
# The issue / PR number is pinned to GITHUB_EVENT_NUMBER so a prompt-injection
# cannot redirect label changes to a different issue.
#
# Only labels in the hardcoded allowlist for the given workflow are accepted.
# Anything else is rejected (not silently dropped) so misuse surfaces in logs.
#

set -euo pipefail

WORKFLOW=""
ACTION=""
LABEL=""

require_value() {
  if [[ $# -lt 2 || -z "${2:-}" || "$2" == --* ]]; then
    echo "Error: $1 requires a value" >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --workflow) require_value "$@"; WORKFLOW="$2"; shift 2 ;;
    --action)   require_value "$@"; ACTION="$2";   shift 2 ;;
    --label)    require_value "$@"; LABEL="$2";    shift 2 ;;
    *)
      echo "Error: unknown argument '$1'" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$WORKFLOW" || -z "$ACTION" || -z "$LABEL" ]]; then
  echo "Usage: $0 --workflow <triage|review> --action <add|remove> --label <label>" >&2
  exit 1
fi

case "$ACTION" in
  add|remove) ;;
  *)
    echo "Error: --action must be 'add' or 'remove'" >&2
    exit 1
    ;;
esac

ISSUE="${GITHUB_EVENT_NUMBER:-}"
if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  echo "Error: GITHUB_EVENT_NUMBER must be a numeric issue/PR number" >&2
  exit 1
fi

# Hardcoded per-workflow allowlists.
TRIAGE_LABELS=("type: bug" "requires-more" "requires-team" "help-wanted" "good first issue" "feedback")
REVIEW_LABELS=("initial-approval" "requires-more" "requires-team")

case "$WORKFLOW" in
  triage) ALLOWED=("${TRIAGE_LABELS[@]}") ;;
  review) ALLOWED=("${REVIEW_LABELS[@]}") ;;
  *)
    echo "Error: --workflow must be 'triage' or 'review'" >&2
    exit 1
    ;;
esac

OK=0
for L in "${ALLOWED[@]}"; do
  if [[ "$L" == "$LABEL" ]]; then OK=1; break; fi
done
if [[ "$OK" -ne 1 ]]; then
  echo "Error: label '$LABEL' is not in the $WORKFLOW allowlist" >&2
  exit 1
fi

# The hardcoded allowlist controls what the agent is permitted to ask
# for, but the repo may not have every allowlisted label defined yet.
# `gh issue edit --add-label` fails hard on unknown labels, which would
# break the whole apply step over one missing label. Skip with a warning
# instead so the rest of the decision still applies.
if ! gh label list --limit 500 --json name --jq '.[].name' | grep -qxF "$LABEL"; then
  echo "Warning: label '$LABEL' is not defined in this repo; skipping $ACTION." >&2
  exit 0
fi

if [[ "$ACTION" == "add" ]]; then
  gh issue edit "$ISSUE" --add-label "$LABEL"
  echo "Added label '$LABEL' to #$ISSUE"
else
  gh issue edit "$ISSUE" --remove-label "$LABEL"
  echo "Removed label '$LABEL' from #$ISSUE"
fi
