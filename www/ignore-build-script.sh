#!/bin/bash

if [[ "$1" == "docs-old" ]]; then
  echo "🛑 - Build cancelled: Can't build old docs"
  exit 0;
fi

PROJECT_NAME="$1"

echo "PROJECT_NAME: $PROJECT_NAME"
echo "VERCEL_ENV: $VERCEL_ENV"
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo "SCRIPT_DIR: $SCRIPT_DIR"

# Check for changes in the www directory (original logic)
$(git diff HEAD^ HEAD --quiet ${SCRIPT_DIR})
diffResult=$?

echo "DIFF RESULT (www): $diffResult"


# Check for production build condition before preview checks
if [[ "$VERCEL_ENV" == "production" && $diffResult -eq 1 ]] ; then
  # Proceed with the build for production with changes
  echo "✅ - Build can proceed (production with changes)"
  exit 1;
fi

# Exit early if the PR branch doesn't start with 'docs/'
if [[ ! "$VERCEL_GIT_COMMIT_REF" =~ ^docs/ ]]; then
  echo "🛑 - Build cancelled: Branch does not start with 'docs/'"
  exit 0;
fi

# For preview environments, check project-specific directories
if [[ "$VERCEL_ENV" == "preview" && -n "$PROJECT_NAME" ]]; then
  # Check for changes in the specific project directory
  PROJECT_DIR="${SCRIPT_DIR}/apps/${PROJECT_NAME}"
  if [[ -d "$PROJECT_DIR" ]]; then
    $(git diff HEAD^ HEAD --quiet ${PROJECT_DIR})
    projectDiffResult=$?
    echo "DIFF RESULT (project ${PROJECT_NAME}): $projectDiffResult"
  else
    projectDiffResult=0
    echo "Project directory ${PROJECT_DIR} does not exist"
  fi
  
  # Check for changes in www/packages directory
  PACKAGES_DIR="${SCRIPT_DIR}/packages"
  if [[ -d "$PACKAGES_DIR" ]]; then
    $(git diff HEAD^ HEAD --quiet ${PACKAGES_DIR})
    packagesDiffResult=$?
    echo "DIFF RESULT (packages): $packagesDiffResult"
  else
    packagesDiffResult=0
    echo "Packages directory ${PACKAGES_DIR} does not exist"
  fi
  
  # For preview, build if there are changes in project dir OR packages dir
  previewShouldBuild=$((projectDiffResult + packagesDiffResult))
  if [[ $previewShouldBuild -gt 0 ]]; then
    previewShouldBuild=1
  fi
  echo "PREVIEW SHOULD BUILD: $previewShouldBuild"

  if [[ $previewShouldBuild -eq 1 ]]; then
    # Proceed with the build for preview if there are changes in project or packages directory
    echo "✅ - Build can proceed (preview with project/packages changes)"
    exit 1;
  fi
fi

# Don't build
echo "🛑 - Build cancelled: Conditions don't match"
exit 0;