#!/bin/bash

# Stackoverflow: How do I programmatically determine if there are uncommitted changes?
# https://stackoverflow.com/questions/3878624/how-do-i-programmatically-determine-if-there-are-uncommitted-changes

IS_CI="${CI:-false}"

if [ "$IS_CI" = true ]; then
  git config --local url."https://github.com/".insteadOf git@github.com:
  git config --local user.name "Medusajs Bot"
  git config --local user.email "core@medusa-commerce.com"
fi

FILE_CHANGES=$(git status --porcelain=v1 | grep 'packages/generated')
FILE_CHANGES_COUNT=$(git status --porcelain=v1 | grep 'packages/generated' | wc -l)

if [ "$IS_CI" = true ]; then
  git config --local --unset user.name
  git config --local --unset user.email
  git config --local --unset url."https://github.com/".insteadOf
fi

if [ "$FILE_CHANGES_COUNT" -ne 0 ]; then
  echo "$FILE_CHANGES"
  echo "Latest codegen build was not committed. Run 'yarn build' and commit generated files."
  exit 1
else
  echo "All has been committed."
  exit 0
fi