import { Compiler } from "@medusajs/framework/build-tools"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { initializeContainer } from "../loaders"
import { generateTypes } from "./utils/generate-types"
import { runLintStep } from "./utils/lint-project"

export default async function build({
  directory,
  adminOnly,
  lint,
  fix,
  quiet,
}: {
  directory: string
  adminOnly: boolean
  lint: boolean
  fix?: boolean
  quiet?: boolean
}) {
  const container = await initializeContainer(directory, {
    skipDbConnection: true,
    throwOnValidationError: false,
  })
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    await generateTypes({
      directory,
      container,
      logger,
    })
  } catch (error) {
    logger.error("Error generating types", error)
    process.exit(1)
  }

  // Lint after type generation.
  await runLintStep({ directory, lint, fix, quiet, logger })

  logger.info("Starting build...")
  const compiler = new Compiler(directory, logger)

  const tsConfig = await compiler.loadTSConfigFile()
  if (!tsConfig) {
    logger.error("Unable to compile application")
    process.exit(1)
  }

  const promises: Promise<boolean>[] = []
  if (!adminOnly) {
    promises.push(compiler.buildAppBackend(tsConfig))
  }

  const bundler = await import("@medusajs/admin-bundler")
  promises.push(compiler.buildAppFrontend(adminOnly, tsConfig, bundler))
  const responses = await Promise.all(promises)

  const buildSucceeded = responses.every((response) => response === true)

  if (buildSucceeded) {
    process.exit(0)
  } else {
    process.exit(1)
  }
}
