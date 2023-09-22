#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_ENV" == "production" || "$VERCEL_GIT_COMMIT_REF" = "docs/"* ]] ; then
  $(git diff HEAD^ HEAD --quiet .)
  diffResult=$?
  if [[ diffResult -eq 0 ]] ; then
    # Don't build
    echo "🛑 - Build cancelled: No diff"
    exit 0;
  fi

  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;
else
  # Don't build
  echo "🛑 - Build cancelled: Conditions don't match"
  exit 0;
fi