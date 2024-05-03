#!/bin/bash

if [[ "$1" == "docs-old" ]]; then
  echo "Can't build old docs"
  exit 0;
fi

echo "VERCEL_ENV: $VERCEL_ENV"
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo "SCRIPT_DIR: $SCRIPT_DIR"

$(git diff HEAD^ HEAD --quiet ${SCRIPT_DIR})
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