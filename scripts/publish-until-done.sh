#!/bin/bash
# Repeats publish-all.sh sweeps until every publishable @zjedene-medusa/*
# package is on the registry, sleeping between rounds to ride out npm's
# account-wide publish quota (429 rate limiting).
#
# Usage: bash scripts/publish-until-done.sh [otp]

OTP="$1"
COOLDOWN=1200 # 20 minutes between rounds
MAX_ROUNDS=24 # ~8 hours worst case

cd "$(dirname "$0")/.." || exit 1

count_remaining() {
  find packages -name "package.json" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/__*/*" -maxdepth 4 | while read f; do
    node -e "
      const p = require('./$f')
      if (p.name && p.name.startsWith('@zjedene-medusa') && !p.private) console.log(p.name + '@' + p.version)
    "
  done | while read spec; do
    published=$(npm view "$spec" version 2>/dev/null)
    if [ "$published" != "${spec##*@}" ]; then
      echo "$spec"
    fi
  done
}

round=1
while [ "$round" -le "$MAX_ROUNDS" ]; do
  echo "=== ROUND $round ($(date)) ==="
  bash scripts/publish-all.sh "$OTP"

  remaining=$(count_remaining)
  remaining_count=$(echo -n "$remaining" | grep -c .)

  if [ "$remaining_count" -eq 0 ]; then
    echo "=== ALL PACKAGES PUBLISHED ($(date)) ==="
    exit 0
  fi

  echo "=== ROUND $round DONE — $remaining_count remaining ==="
  echo "$remaining"
  echo "=== Cooling down ${COOLDOWN}s before next round... ==="
  round=$((round + 1))
  sleep "$COOLDOWN"
done

echo "=== GAVE UP after $MAX_ROUNDS rounds — packages still missing: ==="
count_remaining
exit 1
