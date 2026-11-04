#!/usr/bin/env bash
#
# Fetches a Linear ticket and its comments, sanitized with
# sanitize_untrusted.py, as JSON:
#   {"identifier", "title", "description", "comments": [{"body", "createdAt"}]}
#
# Usage: LINEAR_API_KEY=... ./scripts/get_linear_ticket.sh <TICKET-ID>
#
# Exits 3 without printing the ticket when it contains smuggling content
# (see sanitize_untrusted.py --check), so a model never reads it.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -z "${1:-}" ]] || ! [[ "$1" =~ ^[A-Z]{2,10}-[0-9]{1,7}$ ]]; then
  echo "Usage: $0 <TICKET-ID, e.g. DX-1234>" >&2
  exit 1
fi

: "${LINEAR_API_KEY:?LINEAR_API_KEY not set}"

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

jq -n --arg id "$1" '{
  query: "query($id: String!) { issue(id: $id) { identifier title description comments { nodes { body createdAt } } } }",
  variables: { id: $id }
}' > "$TMP/query.json"

curl -sSf https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  --data @"$TMP/query.json" > "$TMP/ticket.json"

if ! jq -e '.data.issue != null' "$TMP/ticket.json" > /dev/null; then
  echo "Error: Linear ticket $1 not found" >&2
  exit 1
fi

STATUS=0
python3 "$SCRIPT_DIR/sanitize_untrusted.py" --json --check < "$TMP/ticket.json" || STATUS=$?
if [[ "$STATUS" -eq 3 ]]; then
  echo "Error: Linear ticket $1 contains hidden content; not printing it" >&2
  exit 3
elif [[ "$STATUS" -ne 0 ]]; then
  exit 1
fi

python3 "$SCRIPT_DIR/sanitize_untrusted.py" --json < "$TMP/ticket.json" \
  | jq '.data.issue | {identifier, title, description, comments: [.comments.nodes[] | {body, createdAt}]}'
