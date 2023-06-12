import { AdminOptions } from "@medusajs/admin-ui"
import fse from "fs-extra"
import path from "node:path"
import { getPluginPaths } from "./get-plugin-paths"

const MANIFEST_PATH = path.resolve(__dirname, "admin-build-manifest.json")

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

async function getLastTimeModified(appDir: string) {
  const adminPath = path.resolve(appDir, "src", "admin")

  const hasAdminCode = await fse.pathExists(adminPath)

  if (!hasAdminCode) {
    return null
  }

  try {
    const files = await fse.readdir(adminPath)
    const lastModifiedTimes: Date[] = []

    for (const file of files) {
      const filePath = `${adminPath}/${file}`
      const stats = await fse.stat(filePath)
      lastModifiedTimes.push(stats.mtime)
    }

    // Find the latest modified time
    const lastModifiedTime = lastModifiedTimes.reduce(
      (maxTime, currentTime) => {
        return currentTime > maxTime ? currentTime : maxTime
      }
    )

    return lastModifiedTime
  } catch (_error) {
    return null
  }
}

export async function createBuildManifest(
  appDir: string,
  options: AdminOptions
) {
  const packageVersions = await getPackageVersions(appDir)
  const lastModificationTime = await getLastTimeModified(appDir)
  const plugins = await getPluginPaths()

  const { dependencies } = packageVersions

  const buildManifest = {
    dependencies: dependencies,
    modifiedAt: lastModificationTime,
    plugins: plugins,
    options,
  }

  await fse.writeJson(MANIFEST_PATH, buildManifest, {
    spaces: 2,
  })
}

function compareStringArrays(array1: string[], array2: string[]): boolean {
  if (array1.length !== array2.length) {
    return false
  }

  return array1.every((value) => array2.includes(value))
}

function compareObjects(obj1: object, obj2: object): boolean {
  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)

  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }

  return obj1Keys.every((key) => obj2Keys.includes(key))
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

    const optionsChanged = !compareObjects(options, buildManifestOptions)

    if (optionsChanged) {
      return true
    }

    const packageVersions = await getPackageVersions(appDir)

    if (!packageVersions) {
      return true
    }

    const { dependencies } = packageVersions

    const dependenciesChanged = Object.keys(dependencies).some(
      (dependency) =>
        buildManifestDependencies[dependency] !== dependencies[dependency]
    )

    if (dependenciesChanged) {
      return true
    }

    const modifiedAt = await getLastTimeModified(appDir)

    if (!modifiedAt) {
      return true
    }

    const lastModificationTimeChanged =
      modifiedAt > new Date(buildManifestModifiedAt)

    if (lastModificationTimeChanged) {
      return true
    }

    const plugins = await getPluginPaths()

    const pluginsChanged = !compareStringArrays(plugins, buildManifestPlugins)

    if (pluginsChanged) {
      return true
    }

    return false
  } catch (_error) {
    return true
  }
}
