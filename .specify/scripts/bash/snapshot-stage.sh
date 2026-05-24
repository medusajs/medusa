#!/usr/bin/env bash
# snapshot-stage.sh — tag the current commit as <stage>/<slug>/v<N>.
# Implements Principle VII (Artifact Versioning) of the constitution.
#
# Usage:
#   snapshot-stage.sh <stage> <slug>
#
# Args:
#   stage  — one of: spec | clarify | plan | tasks | review
#   slug   — feature slug, e.g. "001-orchestrator"
#
# Behavior:
#   - Counts existing tags matching <stage>/<slug>/v* and creates v<N+1>.
#   - Annotated tag with message "speckit: <stage> stage for <slug>, v<N>".
#   - Prints the new tag name on stdout (for capture by callers).
#   - Idempotent guard: if HEAD already carries an identical-stage tag for this
#     slug at the current commit, prints existing tag and exits 0 (no new tag).
#   - Skips silently with warning if not in a git repo.

set -euo pipefail

stage="${1:?stage required (spec|clarify|plan|tasks|review)}"
slug="${2:?slug required (e.g. 001-orchestrator)}"

case "$stage" in
    spec|clarify|plan|tasks|review) ;;
    *) echo "ERROR: invalid stage '$stage'. Must be one of: spec, clarify, plan, tasks, review" >&2; exit 2 ;;
esac

if ! git rev-parse --show-toplevel >/dev/null 2>&1; then
    echo "[snapshot] WARN: not in a git repo, skipping stage tag" >&2
    exit 0
fi

current_sha=$(git rev-parse HEAD)

# Idempotency: check if HEAD already has a tag for this stage/slug
existing_at_head=$(git tag --points-at HEAD --list "${stage}/${slug}/v*" | head -n1 || true)
if [[ -n "$existing_at_head" ]]; then
    echo "$existing_at_head"
    exit 0
fi

# Find next version number
existing_count=$(git tag --list "${stage}/${slug}/v*" | wc -l | tr -d ' ')
next=$((existing_count + 1))
tag="${stage}/${slug}/v${next}"

git tag -a "$tag" -m "speckit: ${stage} stage for ${slug}, v${next} @ ${current_sha:0:7}"
echo "$tag"
