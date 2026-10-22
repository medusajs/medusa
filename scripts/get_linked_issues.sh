#!/usr/bin/env bash
#
# Fetches the issues a PR will close.
# Usage: ./scripts/get_linked_issues.sh [pr_number]
#
# If pr_number is not provided, reads from the workflow event payload.
#
# For PRs into the default branch, uses GitHub's `closingIssuesReferences`
# (closing keywords in the body plus issues linked from the sidebar). GitHub
# only populates it for the default branch, so for other base branches the
# closing keywords (close/fix/resolve and their forms) are parsed from the
# sanitized body and each referenced issue is verified to exist in this repo
# and to be an issue, not a PR. Cross-repo references are ignored.
#
# Returns a JSON array of {number, title, state, url, labels: [{name}],
# assignees: [{login}]}, or [] if none found. `state` is OPEN or CLOSED.
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
MAX_ISSUES=10

PR_DATA=$(gh api graphql \
  -F owner="${REPO%%/*}" -F name="${REPO#*/}" -F number="$PR" \
  -f query='
query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    defaultBranchRef { name }
    pullRequest(number: $number) {
      baseRefName
      body
      closingIssuesReferences(first: 10) {
        nodes {
          number
          title
          state
          url
          repository { nameWithOwner }
          labels(first: 50) { nodes { name } }
          assignees(first: 20) { nodes { login } }
        }
      }
    }
  }
}')

DEFAULT_BRANCH=$(jq -r '.data.repository.defaultBranchRef.name' <<< "$PR_DATA")
BASE_BRANCH=$(jq -r '.data.repository.pullRequest.baseRefName' <<< "$PR_DATA")

if [[ "$BASE_BRANCH" == "$DEFAULT_BRANCH" ]]; then
  jq --arg repo "$REPO" '[
    .data.repository.pullRequest.closingIssuesReferences.nodes[]
    | select((.repository.nameWithOwner | ascii_downcase) == ($repo | ascii_downcase))
    | {
        number,
        title,
        state,
        url,
        labels: [.labels.nodes[] | {name}],
        assignees: [.assignees.nodes[] | {login}]
      }
  ]' <<< "$PR_DATA" | python3 "$SCRIPT_DIR/sanitize_untrusted.py" --json
  exit 0
fi

ISSUE_NUMBERS=$(jq -r '.data.repository.pullRequest.body // ""' <<< "$PR_DATA" \
  | REPO="$REPO" MAX_ISSUES="$MAX_ISSUES" SCRIPT_DIR="$SCRIPT_DIR" python3 -c '
import os, re, sys
sys.path.insert(0, os.environ["SCRIPT_DIR"])
from sanitize_untrusted import sanitize_text

body = sanitize_text(sys.stdin.read())
repo = os.environ["REPO"].lower()
pattern = re.compile(
    r"(?i)\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s*:?\s+"
    r"(?:([\w.-]+/[\w.-]+)?#(\d+)|https://github\.com/([\w.-]+/[\w.-]+)/issues/(\d+))\b"
)
seen = []
for m in pattern.finditer(body):
    ref_repo = (m.group(1) or m.group(3) or repo).lower()
    number = m.group(2) or m.group(4)
    if ref_repo == repo and number not in seen:
        seen.append(number)
print("\n".join(seen[: int(os.environ["MAX_ISSUES"])]))
')

RESULTS="[]"
while IFS= read -r NUM; do
  [[ -z "$NUM" ]] && continue
  ISSUE_DATA=$(gh api "repos/$REPO/issues/$NUM" --jq 'select(.pull_request == null) | {
    number,
    title,
    state: (.state | ascii_upcase),
    url: .html_url,
    labels: [.labels[] | {name}],
    assignees: [.assignees[] | {login}]
  }' 2>/dev/null || true)
  if [[ -n "$ISSUE_DATA" ]]; then
    RESULTS=$(jq --argjson issue "$ISSUE_DATA" '. + [$issue]' <<< "$RESULTS")
  fi
done <<< "$ISSUE_NUMBERS"

python3 "$SCRIPT_DIR/sanitize_untrusted.py" --json <<< "$RESULTS"
