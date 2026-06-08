#!/bin/bash
# Read-only: reports which @zjedene-medusa/* workspace packages are live on the
# npm registry at their current package.json version, and which are missing.
# Uses only `npm view` (GET) — costs nothing against the publish quota.
#
# Usage: bash scripts/publish-status.sh

cd "$(dirname "$0")/.." || exit 1

live=0
missing=0
missing_list=""

while read -r f; do
  name=$(node -e "const p=require('./$f'); if(p.name && p.name.startsWith('@zjedene-medusa') && !p.private) console.log(p.name)" 2>/dev/null)
  [ -z "$name" ] && continue
  version=$(node -e "console.log(require('./$f').version || '')")
  published=$(npm view "$name@$version" version 2>/dev/null)
  if [ "x$published" = "x$version" ]; then
    live=$((live + 1))
  else
    missing=$((missing + 1))
    missing_list="$missing_list\n  $name@$version"
  fi
done < <(find packages -name "package.json" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/__*/*" -maxdepth 4)

total=$((live + missing))
echo "LIVE:    $live / $total"
echo "MISSING: $missing"
if [ "$missing" -gt 0 ]; then
  echo -e "Missing packages:$missing_list"
fi
