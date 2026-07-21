#!/usr/bin/env bash
#
# Fetches release notes / changelog for a dependency hosted on GitHub, so a
# dependency-update PR review can reason about breaking changes.
#
# Usage:
#   ./scripts/get_dependency_releases.sh <owner/repo> [changelog_path]
#
# Examples:
#   ./scripts/get_dependency_releases.sh expressjs/multer
#   ./scripts/get_dependency_releases.sh nodeca/js-yaml CHANGELOG.md
#
# Behaviour:
#   - Always prints the most recent GitHub Releases (tag, date, body) for the
#     repo. Many packages publish their changelog as GitHub Releases.
#   - If a changelog_path is given (e.g. CHANGELOG.md, History.md), also prints
#     that file's raw contents from the repo's default branch — useful for
#     packages that keep a CHANGELOG file instead of (or in addition to)
#     GitHub Releases.
#
# Security notes:
#   - Read-only. Talks ONLY to api.github.com via `gh api`, using the job's
#     read-only GH_TOKEN. There is no way to point it at an arbitrary host.
#   - <owner/repo> and <changelog_path> come from UNTRUSTED PR content, so they
#     are strictly validated below before being interpolated into any API path.
#     This prevents path traversal / request smuggling / SSRF.
#

set -euo pipefail

SLUG="${1:-}"
CHANGELOG_PATH="${2:-}"
RELEASE_LIMIT=40

if [[ -z "$SLUG" ]]; then
  echo "Error: missing <owner/repo> argument" >&2
  echo "Usage: $0 <owner/repo> [changelog_path]" >&2
  exit 1
fi

# Strict slug validation: exactly "owner/repo", each segment limited to the
# characters GitHub allows in owner/repo names. Rejects anything with "..",
# slashes beyond the single separator, protocol prefixes, query strings, etc.
if ! [[ "$SLUG" =~ ^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$ ]]; then
  echo "Error: invalid repo slug '$SLUG' (expected owner/repo)" >&2
  exit 1
fi

echo "=== GitHub Releases for $SLUG (most recent $RELEASE_LIMIT) ==="
# Some repos have no GitHub Releases (changelog-only) or may be inaccessible.
# Capture via command substitution so a raw error body (e.g. a 404 JSON blob)
# never leaks to stdout; emit a clean note and continue to the changelog file.
if releases=$(gh api "repos/${SLUG}/releases?per_page=${RELEASE_LIMIT}" \
  --jq '.[] | "----------\ntag: \(.tag_name)\ndate: \(.published_at)\n\n\(.body // "(no release body)")\n"' 2>/dev/null) \
  && [[ -n "$releases" ]]; then
  printf '%s\n' "$releases"
else
  echo "(no GitHub Releases found, or the repo is not accessible)"
fi

if [[ -n "$CHANGELOG_PATH" ]]; then
  # Validate the changelog path: a simple relative path, no traversal, no
  # leading slash, no scheme. Keep it to filename-ish segments.
  if ! [[ "$CHANGELOG_PATH" =~ ^[A-Za-z0-9._/-]+$ ]] || [[ "$CHANGELOG_PATH" == *".."* ]] || [[ "$CHANGELOG_PATH" == /* ]]; then
    echo "Error: invalid changelog path '$CHANGELOG_PATH'" >&2
    exit 1
  fi

  echo ""
  echo "=== Changelog file: ${SLUG}/${CHANGELOG_PATH} (truncated to 200 KB) ==="
  # `Accept: application/vnd.github.raw` returns the file content directly,
  # avoiding base64 handling. Capture first (so a 404 JSON body can't leak),
  # then cap the output so a huge changelog can't blow up the context.
  if changelog=$(gh api "repos/${SLUG}/contents/${CHANGELOG_PATH}" \
    -H "Accept: application/vnd.github.raw" 2>/dev/null) && [[ -n "$changelog" ]]; then
    printf '%s' "$changelog" | head -c 200000
  else
    echo "(changelog file not found at that path on the default branch)"
  fi
fi
