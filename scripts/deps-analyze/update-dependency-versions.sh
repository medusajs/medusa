#!/bin/bash

if [ $# -lt 2 ]; then
  echo "Usage: ./update-dependency-versions.sh <package-name> <new-version>"
  echo "Example: ./update-dependency-versions.sh typescript ^5.6.2"
  exit 1
fi

PACKAGE_NAME=$1
NEW_VERSION=$2

echo "=== Updating $PACKAGE_NAME to $NEW_VERSION across all packages ===\n"

# Find all package.json files (excluding node_modules)
find packages -name "package.json" -not -path "*/node_modules/*" | while read -r pkgfile; do
  # Check if package exists in dependencies or devDependencies
  if grep -q "\"$PACKAGE_NAME\":" "$pkgfile"; then
    echo "📝 Updating $pkgfile"

    # Use sed to update the version (works on both macOS and Linux)
    # Using | as delimiter to avoid conflicts with / in package names like @types/react
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      sed -i '' "s|\"$PACKAGE_NAME\": \"[^\"]*\"|\"$PACKAGE_NAME\": \"$NEW_VERSION\"|" "$pkgfile"
    else
      # Linux
      sed -i "s|\"$PACKAGE_NAME\": \"[^\"]*\"|\"$PACKAGE_NAME\": \"$NEW_VERSION\"|" "$pkgfile"
    fi
  fi
done

echo "\n✅ Update complete!"
echo "Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Install dependencies: yarn install"
echo "  3. Test the build: yarn build"
