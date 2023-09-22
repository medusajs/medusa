#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

$(git diff HEAD^ HEAD --quiet .)
diffResult=$?

echo "DIFF RESULT: $diffResult"

if [[ ("$VERCEL_ENV" == "production" && $diffResult -eq 1) || "$VERCEL_GIT_COMMIT_REF" = "docs/"* ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;
else
  # Don't build
  echo "🛑 - Build cancelled: Conditions don't match"
  exit 0;
fi