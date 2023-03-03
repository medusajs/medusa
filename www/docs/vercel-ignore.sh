#!/bin/bash

current_branch=$(git branch --show-current)

if [[ "$VERCEL_DEPLOY_BRANCHES" == *"$current_branch"* ]]; then
  echo "Branch allowed to deploy"
  exit 1;
else
  echo "Branch not allowed to deploy"
  exit 0;
fi