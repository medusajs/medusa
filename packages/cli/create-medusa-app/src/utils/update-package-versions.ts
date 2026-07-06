import { readFileSync, writeFileSync } from "fs"

export function updatePackageVersions(
  packageJsonOrPath: string | Record<string, any>,
  version: string,
  { applyChanges = false }: { applyChanges?: boolean } = {}
): Record<string, any> {
  const packageJson =
    typeof packageJsonOrPath === "string"
      ? JSON.parse(readFileSync(packageJsonOrPath, "utf-8"))
      : packageJsonOrPath

  if (packageJson.dependencies) {
    for (const dependency of Object.keys(packageJson.dependencies)) {
      if (shouldUpdateVersion(dependency)) {
        packageJson.dependencies[dependency] = version
      }
    }
  }
  if (packageJson.devDependencies) {
    for (const dependency of Object.keys(packageJson.devDependencies)) {
      if (shouldUpdateVersion(dependency)) {
        packageJson.devDependencies[dependency] = version
      }
    }
  }

  if (applyChanges && typeof packageJsonOrPath === "string") {
    writeFileSync(packageJsonOrPath, JSON.stringify(packageJson, null, 2))
  }

  return packageJson
}

function shouldUpdateVersion(dependency: string): boolean {
  // UI package follows different versioning, so we can't update it following
  // the same logic as other Medusa packages
  return dependency.startsWith("@medusajs/") && dependency !== "@medusajs/ui"
}
