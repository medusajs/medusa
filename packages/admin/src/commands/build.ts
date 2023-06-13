import {
  build as adminBuild,
  clean,
  type AdminOptions,
} from "@medusajs/admin-ui"
import { resolve } from "node:path"
import { getPluginPaths, loadConfig } from "../utils"
import { createBuildManifest } from "../utils/build-manifest"

type BuildOptions = AdminOptions

export default async function build({ backend, path, outDir }: BuildOptions) {
  const {
    path: configPath,
    backend: configBackend,
    outDir: configOutDir,
  } = loadConfig()

  const plugins = await getPluginPaths()
  const appDir = process.cwd()

  const buildDir = resolve(appDir, outDir || configOutDir)

  await clean({
    appDir: appDir,
    outDir: buildDir,
  })

  await adminBuild({
    appDir: appDir,
    buildDir: buildDir,
    plugins,
    options: {
      path: path || configPath,
      backend: backend || configBackend,
      outDir: buildDir,
    },
  })

  await createBuildManifest(appDir, {
    outDir: outDir || configOutDir,
    path: path || configPath,
    backend: backend || configBackend,
  })
}
