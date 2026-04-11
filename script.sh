#!/bin/bash
# Run after build
for pkg in packages/*/dist packages/*/build; do
  if [ -d "$pkg" ]; then
    echo "$(du -sh $pkg | cut -f1) - $pkg"
  fi
done | sort -hr