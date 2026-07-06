#!/usr/bin/env bash
#
# Converts a GitHub issue to a discussion.
# Usage: ./scripts/convert_to_discussion.sh [issue_number] [category_name]
#
# issue_number: optional, reads from workflow event payload if omitted
# category_name: optional, name of the discussion category (e.g. "Feature Requests", "Support")
#                Falls back to "General", then the first available category.
#
# Requires the GITHUB_TOKEN to have the necessary permissions.
#

set -euo pipefail

# Parse args: first numeric arg is issue number, remaining string is category
ISSUE=""
CATEGORY_NAME=""

if [[ $# -ge 1 && "$1" =~ ^[0-9]+$ ]]; then
  ISSUE="$1"
  shift
fi

if [[ $# -ge 1 ]]; then
  CATEGORY_NAME="$1"
fi

if [[ -z "$ISSUE" ]]; then
  ISSUE=$(jq -r '.issue.number // empty' "${GITHUB_EVENT_PATH:?GITHUB_EVENT_PATH not set}")
fi

if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  echo "Error: no valid issue number provided or found in event payload" >&2
  exit 1
fi

REPO="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY not set}"

# Get the issue node ID
ISSUE_NODE_ID=$(gh api "repos/${REPO}/issues/${ISSUE}" --jq '.node_id')
if [[ -z "$ISSUE_NODE_ID" ]]; then
  echo "Error: could not retrieve node ID for issue #$ISSUE" >&2
  exit 1
fi

# Get all discussion categories
REPO_DATA=$(gh api graphql -f query='
  query($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      discussionCategories(first: 25) {
        nodes { id name }
      }
    }
  }
' -f owner="${REPO%%/*}" -f repo="${REPO##*/}")

# Resolve category: requested name → "General" → first available
if [[ -n "$CATEGORY_NAME" ]]; then
  CATEGORY_ID=$(echo "$REPO_DATA" | jq -r --arg name "$CATEGORY_NAME" '
    .data.repository.discussionCategories.nodes
    | map(select(.name == $name))[0].id // empty
  ')
  if [[ -z "$CATEGORY_ID" ]]; then
    echo "Warning: category '$CATEGORY_NAME' not found, falling back to 'General'" >&2
  fi
fi

if [[ -z "${CATEGORY_ID:-}" ]]; then
  CATEGORY_ID=$(echo "$REPO_DATA" | jq -r '
    .data.repository.discussionCategories.nodes
    | map(select(.name == "General"))[0].id
    // .data.repository.discussionCategories.nodes[0].id
  ')
fi

if [[ -z "$CATEGORY_ID" ]]; then
  echo "Error: could not find a discussion category in the repo" >&2
  exit 1
fi

# Convert the issue to a discussion via GraphQL mutation
gh api graphql -f query='
  mutation($issueId: ID!, $categoryId: ID!) {
    convertIssueToDiscussion(
      input: { issueId: $issueId, categoryId: $categoryId }
    ) {
      discussion { url }
    }
  }
' -f issueId="$ISSUE_NODE_ID" -f categoryId="$CATEGORY_ID"

echo "Converted issue #$ISSUE to a discussion"
