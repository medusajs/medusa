#!/usr/bin/env bash
#
# Checks whether a GitHub login is a Medusa team member.
# Usage: ./scripts/is_team_member.sh <login>
#
# Exits 0 if <login> (case-insensitive) is listed anywhere in
# .github/teams.yml (override with TEAMS_FILE), 1 otherwise.
#

set -euo pipefail

LOGIN="${1:-}"
if ! [[ "$LOGIN" =~ ^[A-Za-z0-9-]+$ ]]; then
  echo "Usage: $0 <login>" >&2
  exit 1
fi

TEAMS_FILE="${TEAMS_FILE:-.github/teams.yml}"

if [[ ! -f "$TEAMS_FILE" ]]; then
  echo "Error: teams file not found at $TEAMS_FILE" >&2
  exit 1
fi

# teams.yml lists members as quoted "@login" entries. Same parsing as
# check_team_review.sh.
TEAM_MEMBERS=$(grep -oE '"@[A-Za-z0-9-]+"' "$TEAMS_FILE" | tr -d '"@' | tr '[:upper:]' '[:lower:]' | sort -u)

if [[ -z "$TEAM_MEMBERS" ]]; then
  echo "Error: no team members parsed from $TEAMS_FILE" >&2
  exit 1
fi

LOGIN_LOWER=$(tr '[:upper:]' '[:lower:]' <<< "$LOGIN")
if grep -qxF "$LOGIN_LOWER" <<< "$TEAM_MEMBERS"; then
  exit 0
fi
exit 1
