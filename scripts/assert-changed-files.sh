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
BRANCH = GITHUB_REF#refs/heads/
echo $BRANCH
FILES_COUNT="$(git diff-tree --no-commit-id --name-only -r "$BRANCH" origin/master | grep -E "$GREP_PATTERN" -c)"

if [ "$IS_CI" = true ]; then
  # reset to previous state
  git reset --hard $GITHUB_SHA
fi

if [ "$FILES_COUNT" -eq 0 ]; then
  echo "0 files matching '$GREP_PATTERN'; exiting and marking successful."
  exit 1
else
  echo "$FILES_COUNT file(s) matching '$GREP_PATTERN'; continuing."
fi
