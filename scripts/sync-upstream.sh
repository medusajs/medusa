#!/bin/bash
# Sync this fork with upstream medusajs/medusa.
#
# This fork is a deterministic transform of upstream: a @medusajs ->
# @zjedene-medusa scope rename plus a few added files (scripts/, docs/). There
# are NO functional source changes, so upstream merges have no semantic
# conflicts — the only recurring work is re-stamping the scope onto whatever
# new @medusajs references upstream introduces. This script automates that.
#
# Steps:
#   1. ensure `upstream` remote, clean tree
#   2. fetch upstream
#   3. merge the target ref, auto-resolving conflicts in upstream's favor
#      (--no-commit; nothing is committed until the build passes)
#   4. re-apply the @zjedene-medusa scope rename everywhere
#   5. re-assert the fork's npm run scripts in root package.json
#   6. regenerate yarn.lock
#   7. build in dependency order
#   8. commit the merge ONLY if the build succeeds
#
# Does NOT bump versions, publish, or push — those are deliberate manual steps
# (see the printed next-steps and scripts/publish-* / release:changed).
#
# Usage: bash scripts/sync-upstream.sh <upstream-ref>
#   e.g. bash scripts/sync-upstream.sh v2.16.0
#        bash scripts/sync-upstream.sh upstream/develop

set -uo pipefail

REF="${1:-}"
UPSTREAM_URL="https://github.com/medusajs/medusa.git"
SCOPE_OLD="@medusajs"
SCOPE_NEW="@zjedene-medusa"

cd "$(dirname "$0")/.." || exit 1

# Resume mode: a merge is already in progress (conflicts resolved + staged by
# hand) — skip the merge and run rename -> lockfile -> build -> commit.
RENAME_ONLY=0
if [ "$REF" = "--rename-only" ]; then
  RENAME_ONLY=1
  if [ ! -f .git/MERGE_HEAD ]; then
    echo "ERROR: --rename-only expects a merge in progress (.git/MERGE_HEAD), none found."
    exit 1
  fi
  if git ls-files --unmerged | grep -q .; then
    echo "ERROR: unresolved conflicts remain. Resolve and 'git add' them first."
    exit 1
  fi
  REF=$(cat .git/MERGE_MSG 2>/dev/null | head -1 | sed 's/^Merge //; s/ into.*//' || echo "upstream")
fi

if [ -z "$REF" ]; then
  echo "Usage: bash scripts/sync-upstream.sh <upstream-ref>"
  echo "  e.g. bash scripts/sync-upstream.sh v2.16.0"
  echo "       bash scripts/sync-upstream.sh upstream/develop"
  echo "       bash scripts/sync-upstream.sh --rename-only   # resume after manual conflict fix"
  exit 1
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$RENAME_ONLY" -eq 0 ]; then
  # --- 1. upstream remote + clean tree ----------------------------------------

  if ! git remote | grep -qx upstream; then
    echo "Adding upstream remote -> $UPSTREAM_URL"
    git remote add upstream "$UPSTREAM_URL"
  fi

  if [ -n "$(git status --porcelain)" ]; then
    echo "ERROR: working tree not clean. Commit or stash changes first."
    exit 1
  fi

  echo "=== Syncing $BRANCH with upstream $REF ==="

  # --- 2. fetch ---------------------------------------------------------------

  echo "Fetching upstream (with tags)..."
  git fetch upstream --tags || { echo "ERROR: fetch failed."; exit 1; }

  # Resolve a bare tag/branch to the upstream remote if needed
  if git rev-parse --verify --quiet "$REF^{commit}" >/dev/null; then
    TARGET="$REF"
  elif git rev-parse --verify --quiet "upstream/$REF^{commit}" >/dev/null; then
    TARGET="upstream/$REF"
  else
    echo "ERROR: ref '$REF' not found locally or on upstream."
    exit 1
  fi
  echo "Resolved target: $TARGET"

  # --- 3. merge (favor upstream on conflict; do not commit yet) ---------------

  echo "Merging $TARGET (conflicts auto-resolved to upstream; scope re-applied next)..."
  git merge --no-commit --no-ff -X theirs "$TARGET"
  MERGE_RC=$?

  # -X theirs should resolve content conflicts; surface any it could not
  # (rename/delete, add/add tree conflicts) for manual handling.
  UNMERGED=$(git ls-files --unmerged | awk '{print $4}' | sort -u)
  if [ -n "$UNMERGED" ]; then
    echo ""
    echo "ERROR: unresolved conflicts (likely rename/delete or add/add):"
    echo "$UNMERGED" | sed 's/^/  /'
    echo ""
    echo "Resolve them, 'git add' each, then resume:"
    echo "  bash scripts/sync-upstream.sh --rename-only"
    exit 1
  fi

  if [ "$MERGE_RC" -ne 0 ] && [ ! -f .git/MERGE_HEAD ]; then
    echo "ERROR: merge failed and left no merge in progress."
    exit 1
  fi
else
  echo "=== Resuming sync on $BRANCH (merge already in progress) ==="
fi

# --- 4. re-apply scope rename -------------------------------------------------

echo "Re-applying $SCOPE_OLD -> $SCOPE_NEW scope rename..."

# package.json files (excludes node_modules, dist, www)
find . -name "package.json" -not -path "*/node_modules/*" -not -path "./www/*" -not -path "*/dist/*" \
  -exec sed -i '' "s/${SCOPE_OLD}/${SCOPE_NEW}/g" {} +

# source files
find packages integration-tests -type f \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.cjs" -o -name "*.mjs" -o -name "*.mts" -o -name "*.cts" \) \
  -not -path "*/node_modules/*" -not -path "*/dist/*" \
  -exec sed -i '' "s/${SCOPE_OLD}/${SCOPE_NEW}/g" {} +

# config files
for cfg in .changeset/config.json packages/design-system/ui/tsconfig.json packages/design-system/icons/tsconfig.json; do
  [ -f "$cfg" ] && sed -i '' "s/${SCOPE_OLD}/${SCOPE_NEW}/g" "$cfg"
done
# pending changesets
[ -d .changeset ] && find .changeset -name "*.md" -exec sed -i '' "s/${SCOPE_OLD}/${SCOPE_NEW}/g" {} +

# verify no stray references in code (www/, CHANGELOG, README, .txt fixtures are OK)
STRAY=$(grep -rl "$SCOPE_OLD" packages integration-tests .changeset 2>/dev/null \
  --exclude-dir=node_modules --exclude-dir=dist \
  | grep -vE '\.(md|txt)$' | head -20)
if [ -n "$STRAY" ]; then
  echo "WARNING: $SCOPE_OLD still present in code files (inspect — may need manual rename):"
  echo "$STRAY" | sed 's/^/  /'
fi

# --- 5. re-assert the fork's npm run scripts ----------------------------------

echo "Ensuring fork npm run scripts in root package.json..."
node -e '
  const fs = require("fs")
  const p = JSON.parse(fs.readFileSync("package.json", "utf8"))
  p.scripts = p.scripts || {}
  const forkScripts = {
    "publish:status": "bash scripts/publish-status.sh",
    "publish:remaining": "bash scripts/publish-all.sh",
    "release:core": "node scripts/release-core-packages.js",
    "release:core-flows": "node scripts/release-workflow.js",
    "release:changed": "node scripts/release-changed-packages.js",
    "sync:upstream": "bash scripts/sync-upstream.sh",
  }
  let added = []
  for (const [k, v] of Object.entries(forkScripts)) {
    if (p.scripts[k] !== v) { p.scripts[k] = v; added.push(k) }
  }
  if (added.length) {
    fs.writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n")
    console.log("  re-added: " + added.join(", "))
  } else {
    console.log("  all present")
  }
'

# --- 6. regenerate lockfile ---------------------------------------------------

echo "Regenerating yarn.lock..."
rm -f yarn.lock
yarn install || { echo "ERROR: yarn install failed. Resolve, then build + commit manually."; exit 1; }

# --- 7. build -----------------------------------------------------------------

echo "Building (dependency order via turbo)..."
if ! yarn build; then
  echo ""
  echo "ERROR: build failed. The merge + rename are staged but NOT committed."
  echo "Likely an upstream breaking change. Fix, 'yarn build' until green, then:"
  echo "  git add -A && git commit   # finalizes the merge commit"
  exit 1
fi

# --- 8. commit ----------------------------------------------------------------

git add -A
git commit --no-edit -m "$(cat <<EOF
Merge upstream $REF and re-apply @zjedene-medusa scope

Auto-resolved conflicts to upstream, re-stamped the fork scope over
new @medusajs references, regenerated yarn.lock, build verified.
EOF
)"

echo ""
echo "=== Sync complete. Build green, merge committed (not pushed). ==="
echo "Next:"
echo "  1. Sanity check: git show --stat HEAD | tail; yarn test (optional)"
echo "  2. Bump all packages to the new upstream version, e.g.:"
echo "       node scripts/release-changed-packages.js <new-version> --since HEAD~1 --dry-run"
echo "     (or republish the full suite with publish:remaining after bumping)"
echo "  3. Verify registry: yarn publish:status"
echo "  4. git push origin $BRANCH"
