import { build as adminBuild, clean } from "@medusajs/admin-ui"
import { resolve } from "path"
import { BuildOptions } from "../types"
import { getPluginPaths, loadConfig } from "../utils"
import { createBuildManifest } from "../utils/build-manifest"

export default async function build({
  backend,
  path,
  outDir,
  deployment,
}: BuildOptions) {
  const {
    path: configPath,
    backend: configBackend,
    outDir: configOutDir,
  } = loadConfig()

  const plugins = await getPluginPaths()
  const appDir = process.cwd()

  const outDirOption = resolve(appDir, outDir || configOutDir)
  const pathOption = deployment ? path || "/" : path || configPath
  const backendOption = deployment
    ? backend || process.env.MEDUSA_ADMIN_BACKEND_URL
    : backend || configBackend

  await clean({
    appDir: appDir,
    outDir: outDirOption,
  })

  await adminBuild({
    appDir: appDir,
    buildDir: outDirOption,
    plugins,
    options: {
      path: pathOption,
      backend: backendOption,
      outDir: outDirOption,
    },
  })

  await createBuildManifest(appDir, {
    outDir: outDir || configOutDir,
    path: path || configPath,
    backend: backend || configBackend,
    deployment,
  })
}
