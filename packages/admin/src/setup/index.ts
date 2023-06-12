import { build, clean, logger } from "@medusajs/admin-ui"
import { getPluginPaths, loadConfig } from "../utils"
import { createBuildManifest, shouldBuild } from "../utils/build-manifest"

export default async function setupAdmin() {
  const { autoRebuild, serve, backend, outDir, path } = loadConfig()

  if (process.env.COMMAND_INITIATED_BY === "develop") {
    logger.info("Running in development mode. Skipping setup.")
    return
  }

  if (!serve) {
    return
  }

  if (!autoRebuild) {
    return
  }

  const appDir = process.cwd()

  const shouldContinue = await shouldBuild(appDir, {
    backend,
    path,
    outDir,
  })

  if (!shouldContinue) {
    return
  }

  const plugins = await getPluginPaths()

  await clean({
    appDir,
    outDir: outDir,
  })

  await build({
    appDir,
    buildDir: outDir,
    options: {
      backend,
      path,
      outDir,
    },
    plugins,
    reporting: "minimal", // The fancy reporting does not work well when run as part of the setup script
  })

  await createBuildManifest(appDir, {
    backend,
    path,
    outDir,
  })
}
