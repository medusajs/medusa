#!/usr/bin/env bash
#
# Determines whether a PR has already been looked at by a Medusa team member.
# Usage: ./scripts/check_team_review.sh [pr_number]
#
# If pr_number is not provided, reads from the workflow event payload.
#
# A PR counts as "reviewed by the team" when a team member (as listed in
# .github/teams.yml) has either submitted a review or left a comment on it —
# a comment is treated as a sign that a human on the team has looked at the
# PR, even if they never formally submitted a review. The PR author is
# excluded: authoring a PR is not reviewing it.
#
# Prints `true` or `false` on stdout.
#

set -euo pipefail

if [[ -n "${1:-}" ]]; then
  PR="$1"
else
  PR=$(jq -r '.pull_request.number // .issue.number // empty' "${GITHUB_EVENT_PATH:?GITHUB_EVENT_PATH not set}")
fi

if ! [[ "$PR" =~ ^[0-9]+$ ]]; then
  echo "Error: no valid PR number provided or found in event payload" >&2
  exit 1
fi

REPO="${GITHUB_REPOSITORY:-medusajs/medusa}"
TEAMS_FILE="${TEAMS_FILE:-.github/teams.yml}"

if [[ ! -f "$TEAMS_FILE" ]]; then
  echo "Error: teams file not found at $TEAMS_FILE" >&2
  exit 1
fi

# teams.yml lists members as quoted "@login" entries. Extract the logins,
# lowercased, so the comparison below is case-insensitive (GitHub logins are).
TEAM_MEMBERS=$(grep -oE '"@[A-Za-z0-9-]+"' "$TEAMS_FILE" | tr -d '"@' | tr '[:upper:]' '[:lower:]' | sort -u)

if [[ -z "$TEAM_MEMBERS" ]]; then
  echo "Error: no team members parsed from $TEAMS_FILE" >&2
  exit 1
fi

AUTHOR=$(gh pr view "$PR" --repo "$REPO" --json author --jq '.author.login // ""' | tr '[:upper:]' '[:lower:]')

# Reviewers (any review state) and comment authors, minus bots.
REVIEWERS=$(gh api "repos/$REPO/pulls/$PR/reviews" --paginate \
  --jq '.[] | select(.user.type != "Bot") | .user.login' 2>/dev/null | tr '[:upper:]' '[:lower:]' || true)
COMMENTERS=$(gh api "repos/$REPO/issues/$PR/comments" --paginate \
  --jq '.[] | select(.user.type != "Bot") | .user.login' 2>/dev/null | tr '[:upper:]' '[:lower:]' || true)
REVIEW_COMMENTERS=$(gh api "repos/$REPO/pulls/$PR/comments" --paginate \
  --jq '.[] | select(.user.type != "Bot") | .user.login' 2>/dev/null | tr '[:upper:]' '[:lower:]' || true)

PARTICIPANTS=$(printf '%s\n%s\n%s\n' "$REVIEWERS" "$COMMENTERS" "$REVIEW_COMMENTERS" \
  | sed '/^$/d' | sort -u | grep -v "^${AUTHOR}$" || true)

if [[ -z "$PARTICIPANTS" ]]; then
  echo "false"
  exit 0
fi

if comm -12 <(printf '%s\n' "$TEAM_MEMBERS") <(printf '%s\n' "$PARTICIPANTS") | grep -q .; then
  echo "true"
else
  echo "false"
fi
