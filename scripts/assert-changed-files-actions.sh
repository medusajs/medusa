#!/bin/bash

IS_CI="${CI:-false}"
GREP_PATTERN=$1

if [ "$IS_CI" = true ]; then
  git config --local url."https://github.com/".insteadOf git@github.com:
  git config --local user.name "Medusajs Bot"
  git config --local user.email "core@medusa-commerce.com"

  git fetch origin
  git merge --no-edit origin/master

  if [ $? -ne 0 ]; then
    echo "Branch has conflicts with master, rolling back test."
    git merge --abort
  fi

  git config --local --unset user.name
  git config --local --unset user.email
  git config --local --unset url."https://github.com/".insteadOf
fi

# Make sure that we are diffing towards the right branch, in github actions this is different
# depending on whether or not we are creating a pull request or not.
[ ! -z ${GITHUB_BASE_REF} ] && HAS_BASE=true || HAS_BASE=false
[ HAS_BASE = true ] && COMPARE="${GITHUB_BASE_REF#refs/heads/}" || COMPARE="develop"
FILES_COUNT="$(git diff-tree --no-commit-id --name-only -r origin/"$COMPARE" | grep -E "$GREP_PATTERN" -c)"

if [ "$IS_CI" = true ]; then
  # reset to previous state
  git reset --hard $GITHUB_SHA
fi

if [ "$FILES_COUNT" -eq 0 ]; then
  echo "0 files matching '$GREP_PATTERN'; exiting and marking successful."
  exit 0
else
  echo "$FILES_COUNT file(s) matching '$GREP_PATTERN'; continuing."
fi
