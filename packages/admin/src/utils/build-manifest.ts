import { AdminOptions } from "@medusajs/admin-ui"
import fse from "fs-extra"
import isEqual from "lodash/isEqual"
import isNil from "lodash/isNil"
import path from "path"
import { BuildOptions } from "../types"
import { getPluginPaths } from "./get-plugin-paths"

const MANIFEST_PATH = path.resolve(
  process.cwd(),
  ".cache",
  "admin-build-manifest.json"
)

async function getPackageVersions(appDir: string) {
  const packageJsonPath = path.resolve(appDir, "package.json")

  try {
    const { dependencies } = await fse.readJson(packageJsonPath)

    return {
      dependencies,
    }
  } catch (_err) {
    return null
  }
}

async function getLastTimeModifiedAt(appDir: string) {
  const adminPath = path.resolve(appDir, "src", "admin")

  // Get the most recent time a file in the admin directory was modified and do it recursively for all subdirectories and files
  let mostRecentTimestamp = 0

  const pathExists = await fse.pathExists(adminPath)

  if (!pathExists) {
    return mostRecentTimestamp
  }

  async function processFolder(dir: string) {
    const files = await fse.readdir(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stats = await fse.stat(filePath)

      if (stats.isDirectory()) {
        await processFolder(filePath) // Recursively process subfolders
      } else {
        const { mtimeMs } = stats
        mostRecentTimestamp = Math.max(mostRecentTimestamp, mtimeMs)
      }
    }
  }

  await processFolder(adminPath)

  return mostRecentTimestamp
}

export async function createBuildManifest(
  appDir: string,
  options: BuildOptions
) {
  const packageVersions = await getPackageVersions(appDir)
  const lastModificationTime = await getLastTimeModifiedAt(appDir)
  const plugins = await getPluginPaths()

  const { dependencies } = packageVersions

  const buildManifest = {
    dependencies: dependencies,
    modifiedAt: lastModificationTime,
    plugins: plugins,
    options,
  }

  await fse.outputFile(MANIFEST_PATH, JSON.stringify(buildManifest, null, 2))
}

export async function shouldBuild(appDir: string, options: AdminOptions) {
  try {
    const manifestExists = await fse.pathExists(MANIFEST_PATH)

    if (!manifestExists) {
      return true
    }

    const buildManifest = await fse.readJson(MANIFEST_PATH)

    const {
      dependencies: buildManifestDependencies,
      modifiedAt: buildManifestModifiedAt,
      plugins: buildManifestPlugins,
      options: buildManifestOptions,
    } = buildManifest

    const optionsChanged = !isEqual(options, buildManifestOptions)

    if (optionsChanged) {
      return true
    }

    const packageVersions = await getPackageVersions(appDir)

    if (!packageVersions) {
      return true
    }

    const { dependencies } = packageVersions

    const dependenciesChanged = !isEqual(
      dependencies,
      buildManifestDependencies
    )

    if (dependenciesChanged) {
      return true
    }

    const modifiedAt = await getLastTimeModifiedAt(appDir)

    if (isNil(modifiedAt)) {
      return true
    }

    const lastModificationTimeChanged = modifiedAt !== buildManifestModifiedAt

    if (lastModificationTimeChanged) {
      return true
    }

    const plugins = await getPluginPaths()

    const pluginsChanged = !isEqual(plugins, buildManifestPlugins)

    if (pluginsChanged) {
      return true
    }

    return false
  } catch (_error) {
    return true
  }
}
