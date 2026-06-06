#!/bin/bash
# Paced publisher for the initial @zjedene-medusa/* bulk publish.
#
# npm enforces an undocumented publish burst quota (~25-30 publishes), and
# failed retries against the limiter EXTEND the block. So this script:
#   - waits out an initial cooldown before the first attempt
#   - publishes with PACE seconds between successful publishes
#   - voluntarily pauses after BATCH_LIMIT publishes
#   - on a 429: full stop for COOLDOWN, then ONE probe; a second consecutive
#     429 aborts the whole run (window is longer — rerun later)
#
# Usage: bash scripts/publish-paced.sh [initial_cooldown_seconds]

PACE=90
BATCH_LIMIT=20
COOLDOWN=2700               # 45 min
INITIAL_WAIT="${1:-2700}"   # default 45 min — let the limiter forget us

cd "$(dirname "$0")/.." || exit 1

SPECS_FILE=$(mktemp)
find packages -name "package.json" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/__*/*" -maxdepth 4 | while read f; do
  node -e "
    const p = require('./$f')
    if (p.name && p.name.startsWith('@zjedene-medusa') && !p.private) console.log(p.name + '@' + p.version + ' ' + '$f'.replace(/\/package\.json$/, ''))
  "
done > "$SPECS_FILE"

total=$(grep -c . "$SPECS_FILE")
echo "=== $total publishable packages; initial cooldown ${INITIAL_WAIT}s ==="
sleep "$INITIAL_WAIT"

batch_count=0
consecutive_429=0

while read -r spec dir; do
  version="${spec##*@}"

  published=$(npm view "$spec" version 2>/dev/null)
  if [ "$published" == "$version" ]; then
    echo "SKIP: $spec"
    continue
  fi

  if [ "$batch_count" -ge "$BATCH_LIMIT" ]; then
    echo "=== Batch limit ($BATCH_LIMIT) reached — voluntary cooldown ${COOLDOWN}s ==="
    sleep "$COOLDOWN"
    batch_count=0
  fi

  echo "Publishing $spec from $dir..."
  output=$(npm publish "./$dir" --access public 2>&1)

  if echo "$output" | grep -q "code E429"; then
    consecutive_429=$((consecutive_429 + 1))
    if [ "$consecutive_429" -ge 2 ]; then
      echo "=== ABORT: second 429 after a full cooldown — quota window longer than ${COOLDOWN}s. Rerun later. ==="
      exit 2
    fi
    echo "=== 429 — full stop, cooling ${COOLDOWN}s before one probe ==="
    sleep "$COOLDOWN"
    batch_count=0
    output=$(npm publish "./$dir" --access public 2>&1)
    if echo "$output" | grep -q "code E429"; then
      echo "=== ABORT: probe after cooldown still 429. Rerun later. ==="
      exit 2
    fi
  fi

  if echo "$output" | grep -q "^+ @zjedene-medusa"; then
    echo "PUBLISHED: $spec"
    consecutive_429=0
    batch_count=$((batch_count + 1))
    sleep "$PACE"
  else
    echo "FAILED: $spec"
    echo "$output" | tail -5
  fi
done < "$SPECS_FILE"

rm -f "$SPECS_FILE"
echo "=== RUN COMPLETE ($(date)) ==="
