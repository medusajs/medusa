#!/usr/bin/env bash
#
# Fetches PRs linked to an issue via cross-reference or connected events.
# Usage: ./scripts/get_linked_prs.sh <issue_number>
#
# Returns a JSON array of linked PR objects, or [] if none found.
#

set -euo pipefail

if [[ -z "${1:-}" ]] || ! [[ "$1" =~ ^[0-9]+$ ]]; then
  echo "Usage: $0 <issue_number>" >&2
  exit 1
fi

ISSUE="$1"
REPO_OWNER="medusajs"
REPO_NAME="medusa"

RESULT=$(gh api graphql -f query="
{
  repository(owner: \"${REPO_OWNER}\", name: \"${REPO_NAME}\") {
    issue(number: ${ISSUE}) {
      timelineItems(itemTypes: [CONNECTED_EVENT, CROSS_REFERENCED_EVENT], first: 20) {
        nodes {
          __typename
          ... on ConnectedEvent {
            subject {
              ... on PullRequest {
                number
                title
                state
                url
              }
            }
          }
          ... on CrossReferencedEvent {
            source {
              ... on PullRequest {
                number
                title
                state
                url
              }
            }
          }
        }
      }
    }
  }
}" 2>/dev/null)

# Extract PR objects from both event types, deduplicate by number
echo "$RESULT" | jq '[
  .data.repository.issue.timelineItems.nodes[] |
  if .__typename == "ConnectedEvent" then .subject
  elif .__typename == "CrossReferencedEvent" then .source
  else empty end |
  select(.number != null)
] | unique_by(.number)'
