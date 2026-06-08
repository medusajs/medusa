#!/bin/bash
# Publishes every @zjedene-medusa/* workspace package that is not yet on the
# registry at its current package.json version. Used for the initial
# full-suite publish (the release-* scripts only handle incremental releases).
#
# Requires: packages already built (run `yarn build` first), npm auth set up
# in ~/.npmrc (never commit the token).
#
# Usage: bash scripts/publish-all.sh [otp]
# Example: bash scripts/publish-all.sh 123456

OTP="$1"
OTP_FLAG=""
if [ -n "$OTP" ]; then
  OTP_FLAG="--otp=$OTP"
fi

cd "$(dirname "$0")/.." || exit 1

# Process substitution (not `find | while`) so an `exit` inside the loop
# propagates to the script's real exit code instead of dying in a subshell.
while read -r f; do
  dir=$(dirname "$f")
  name=$(node -e "console.log(require('./$f').name || '')")
  version=$(node -e "console.log(require('./$f').version || '')")
  private=$(node -e "console.log(require('./$f').private ? 'true' : '')")
  if [ -n "$private" ]; then
    continue
  fi
  if [[ "$name" == @zjedene-medusa/* ]]; then
    published=$(npm view "$name@$version" version 2>/dev/null)
    if [ "$published" != "$version" ]; then
      echo "Publishing $name@$version from $dir..."
      # ./ prefix forces path interpretation — a bare single-slash path like
      # "packages/medusa" parses as a GitHub user/repo shorthand
      # Single attempt — npm publish quota (429) is account-wide; failed
      # retries against the limiter extend the block, so abort the whole
      # sweep on the first 429.
      output=$(npm publish "./$dir" --access public $OTP_FLAG 2>&1)
      echo "$output"
      if echo "$output" | grep -q "code E429"; then
        echo "=== ABORT: 429 rate limit — quota still active. Stop all attempts, retry later. ==="
        exit 2
      fi
      echo "$output" | grep -q "^+ @zjedene-medusa" || echo "FAILED: $name"
      sleep 5
    else
      echo "SKIP: $name@$version already published"
    fi
  fi
done < <(find packages -name "package.json" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/__*/*" -maxdepth 4)
