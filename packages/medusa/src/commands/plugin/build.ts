import { Compiler } from "@zjedene-medusa/framework/build-tools"
import { logger } from "@zjedene-medusa/framework/logger"

export default async function build({ directory }: { directory: string }) {
  logger.info("Starting build...")
  const compiler = new Compiler(directory, logger)

  const tsConfig = await compiler.loadTSConfigFile()
  if (!tsConfig) {
    logger.error("Unable to compile plugin")
    process.exit(1)
  }

  const bundler = await import("@zjedene-medusa/admin-bundler")
  const responses = await Promise.all([
    compiler.buildPluginBackend(tsConfig),
    compiler.buildPluginAdminExtensions(bundler),
  ])

  if (responses.every((response) => response === true)) {
    process.exit(0)
  } else {
    process.exit(1)
  }
}
