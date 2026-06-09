#!/usr/bin/env bash
#
# Posts a comment on a GitHub issue / PR using a server-side template.
#
# Usage:
#   GITHUB_EVENT_NUMBER=123 ./scripts/add_comment.sh \
#       --workflow <triage|review> \
#       --template <template-id> \
#       [--params-file <path>]
#
# The issue / PR number is pinned to GITHUB_EVENT_NUMBER. The script refuses
# to accept it on the command line so a prompt-injection cannot redirect the
# comment to an unrelated issue.
#
# Templates live in .github/<workflow>-templates/<template-id>.md and must
# exist in the repository checkout. Unknown templates are rejected.
#
# --params-file points to a JSON object. Each top-level key matching the
# regex `[A-Z][A-Z0-9_]*` is interpolated into the template wherever the
# literal placeholder `{{KEY}}` appears. Keys that don't match the regex
# (e.g. lowercase keys) are ignored — the caller is responsible for
# producing uppercase keys that match the placeholders. All values are
# coerced to string and lightly sanitized: CR + null bytes are removed,
# backticks are stripped, and `&` / `<` / `>` are HTML-escaped. This
# blocks inline code spans and raw HTML, but is NOT a full Markdown
# sanitizer — other constructs (`**bold**`, `_italic_`, `[link](url)`,
# headings, lists, etc.) still render. Don't rely on this as the only
# defense against attacker-supplied prose; the upstream schema validator
# also caps length and constrains the field set. Any placeholder left in
# the template after substitution is removed.
#

set -euo pipefail

WORKFLOW=""
TEMPLATE=""
PARAMS_FILE=""

require_value() {
  # Treat a missing arg, an empty string, or a next token that looks
  # like another flag (`--foo`) as a missing value so the failure points
  # at the right argument.
  if [[ $# -lt 2 || -z "${2:-}" || "$2" == --* ]]; then
    echo "Error: $1 requires a value" >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --workflow)     require_value "$@"; WORKFLOW="$2";    shift 2 ;;
    --template)     require_value "$@"; TEMPLATE="$2";    shift 2 ;;
    --params-file)  require_value "$@"; PARAMS_FILE="$2"; shift 2 ;;
    *)
      echo "Error: unknown argument '$1'" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$WORKFLOW" || -z "$TEMPLATE" ]]; then
  echo "Usage: $0 --workflow <triage|review> --template <id> [--params-file <path>]" >&2
  exit 1
fi

case "$WORKFLOW" in
  triage|review) ;;
  *)
    echo "Error: --workflow must be 'triage' or 'review'" >&2
    exit 1
    ;;
esac

if ! [[ "$TEMPLATE" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "Error: invalid template id '$TEMPLATE'" >&2
  exit 1
fi

ISSUE="${GITHUB_EVENT_NUMBER:-}"
if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  echo "Error: GITHUB_EVENT_NUMBER must be a numeric issue/PR number" >&2
  exit 1
fi

TEMPLATE_PATH=".github/${WORKFLOW}-templates/${TEMPLATE}.md"
if [[ ! -f "$TEMPLATE_PATH" ]]; then
  echo "Error: template not found: $TEMPLATE_PATH" >&2
  exit 1
fi

if [[ -n "$PARAMS_FILE" && ! -f "$PARAMS_FILE" ]]; then
  echo "Error: params file not found: $PARAMS_FILE" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "Error: python3 is required to render comment templates but was not found in PATH" >&2
  exit 1
fi

# Render the template in Python for robust handling of multi-line values
# and literal-string substitution (no shell-quoting / regex pitfalls).
OUT_FILE=$(mktemp)
trap 'rm -f "$OUT_FILE"' EXIT

TEMPLATE_PATH="$TEMPLATE_PATH" PARAMS_FILE="${PARAMS_FILE:-}" OUT_FILE="$OUT_FILE" \
  python3 - <<'PY'
import json, os, re

with open(os.environ["TEMPLATE_PATH"], "r", encoding="utf-8") as f:
    body = f.read()

params = {}
params_file = os.environ.get("PARAMS_FILE") or ""
if params_file:
    with open(params_file, "r", encoding="utf-8") as f:
        params = json.load(f)
    if not isinstance(params, dict):
        raise SystemExit("params file must contain a JSON object")

BACKTICK = chr(96)

def sanitize(value):
    if isinstance(value, list):
        return "\n".join("- " + sanitize(v) for v in value)
    if value is None:
        return ""
    s = str(value)
    s = s.replace("\r", "").replace("\x00", "")
    s = s.replace(BACKTICK, "")
    # Escape `&` first so that pre-existing entities like `&lt;` in the
    # input remain literal text (`&amp;lt;`) instead of rendering as `<`.
    s = s.replace("&", "&amp;")
    s = s.replace("<", "&lt;").replace(">", "&gt;")
    return s

for key, value in params.items():
    if not re.fullmatch(r"[A-Z][A-Z0-9_]*", str(key)):
        continue
    body = body.replace("{{" + key + "}}", sanitize(value))

body = re.sub(r"\{\{[A-Z0-9_]+\}\}", "", body)

with open(os.environ["OUT_FILE"], "w", encoding="utf-8") as f:
    f.write(body)
PY

gh issue comment "$ISSUE" --body-file "$OUT_FILE"
echo "Comment posted on #$ISSUE using template $WORKFLOW/$TEMPLATE"
