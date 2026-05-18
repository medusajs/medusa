#!/usr/bin/env bash
#
# Searches for GitHub issues matching a query.
# Usage: ./scripts/search_issues.sh <query>
#
# Returns matching issues (number, title, state, url).
# Searches both open and closed issues to catch duplicates.
#

set -euo pipefail

if [[ $# -eq 0 || -z "${1:-}" ]]; then
  echo "Usage: $0 <query>" >&2
  exit 1
fi

QUERY="$1"
REPO="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY not set}"
SEARCH_QUERY="repo:${REPO} is:issue ${QUERY}"

gh search issues "$SEARCH_QUERY" --limit 10 --json number,title,state,url,createdAt \
  --jq '.[] | {number: .number, title: .title, state: .state, url: .url, createdAt: .createdAt}'
