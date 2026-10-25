#!/usr/bin/env bash
#
# Creates a Linear ticket for an escalated GitHub issue and links the issue
# to it, unless a ticket already links to that issue.
#
# Usage: LINEAR_API_KEY=... ./scripts/escalate_to_linear.sh --issue <number> --description-file <file> [--title <title>] [--team CORE|CLO]
#
# Without --title, the sanitized GitHub issue title is used, which needs GH_TOKEN.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ISSUE=""
TITLE=""
DESCRIPTION_FILE=""
TEAM_KEY="CORE"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --issue) ISSUE="${2:-}"; shift 2 ;;
    --title) TITLE="${2:-}"; shift 2 ;;
    --description-file) DESCRIPTION_FILE="${2:-}"; shift 2 ;;
    --team) TEAM_KEY="${2:-}"; shift 2 ;;
    *) echo "Error: unknown argument $1" >&2; exit 1 ;;
  esac
done

if ! [[ "$ISSUE" =~ ^[0-9]{1,7}$ ]] || [[ ! -s "$DESCRIPTION_FILE" ]]; then
  echo "Usage: $0 --issue <number> --description-file <file> [--title <title>] [--team CORE|CLO]" >&2
  exit 1
fi
if ! [[ "$TEAM_KEY" =~ ^(CORE|CLO)$ ]]; then
  echo "Error: --team must be CORE or CLO" >&2
  exit 1
fi

: "${LINEAR_API_KEY:?LINEAR_API_KEY not set}"

REPO="${GITHUB_REPOSITORY:-medusajs/medusa}"
URL="https://github.com/$REPO/issues/$ISSUE"

linear() {
  curl -sSf https://api.linear.app/graphql \
    -H "Content-Type: application/json" \
    -H "Authorization: $LINEAR_API_KEY" \
    --data @-
}

EXISTING=$(jq -n --arg url "$URL" '{
  query: "query($url: String!) { attachmentsForURL(url: $url) { nodes { issue { identifier team { key } } } } }",
  variables: { url: $url }
}' | linear | jq -r --arg team "$TEAM_KEY" '
  [.data.attachmentsForURL.nodes[]?.issue | select(.team.key == $team) | .identifier][0] // empty
')
if [[ -n "$EXISTING" ]]; then
  echo "Linear ticket $EXISTING already links to #$ISSUE; not creating another."
  echo "### Linear ticket $EXISTING already exists" >> "${GITHUB_STEP_SUMMARY:-/dev/null}"
  exit 0
fi

if [[ -z "$TITLE" ]]; then
  TITLE=$(gh issue view "$ISSUE" --repo "$REPO" --json title \
    | python3 "$SCRIPT_DIR/sanitize_untrusted.py" --json \
    | jq -r '.title')
fi
TITLE=$(jq -rn --arg t "$TITLE" '$t | gsub("[\r\n]+"; " ") | gsub("^\\s+|\\s+$"; "") | .[0:120]')
if [[ -z "$TITLE" ]]; then
  TITLE="GitHub issue #$ISSUE"
fi

TEAM_ID=$(jq -n --arg key "$TEAM_KEY" '{
  query: "query($key: String!) { teams(filter: { key: { eq: $key } }) { nodes { id } } }",
  variables: { key: $key }
}' | linear | jq -r '.data.teams.nodes[0].id // empty')
if [[ -z "$TEAM_ID" ]]; then
  echo "Error: Linear team $TEAM_KEY not found" >&2
  exit 1
fi

CREATED=$(jq -n --arg teamId "$TEAM_ID" --arg title "$TITLE" --rawfile description "$DESCRIPTION_FILE" '{
  query: "mutation($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id identifier } } }",
  variables: { input: { teamId: $teamId, title: $title, description: $description } }
}' | linear)

if ! jq -e '.data.issueCreate.success == true' <<<"$CREATED" > /dev/null; then
  echo "Error: failed to create the Linear issue" >&2
  jq '.errors' <<<"$CREATED" >&2 || true
  exit 1
fi
LINEAR_ID=$(jq -r '.data.issueCreate.issue.id' <<<"$CREATED")
IDENTIFIER=$(jq -r '.data.issueCreate.issue.identifier' <<<"$CREATED")

# The duplicate check above finds tickets through this attachment.
ATTACHED=$(jq -n --arg issueId "$LINEAR_ID" --arg url "$URL" '{
  query: "mutation($issueId: String!, $url: String!) { attachmentLinkURL(issueId: $issueId, url: $url) { success } }",
  variables: { issueId: $issueId, url: $url }
}' | linear || true)
if ! jq -e '.data.attachmentLinkURL.success == true' <<<"$ATTACHED" > /dev/null 2>&1; then
  echo "::warning::Created $IDENTIFIER but could not attach $URL."
fi

echo "Created Linear ticket $IDENTIFIER"
echo "### Created Linear issue $IDENTIFIER" >> "${GITHUB_STEP_SUMMARY:-/dev/null}"
