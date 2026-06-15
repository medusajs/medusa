import { logger } from "@medusajs/framework/logger"
import { hasEslintConfig, lintProject } from "./utils/lint-project"

export default async function lint({
  directory,
  paths,
  fix,
  quiet,
}: {
  directory: string
  paths?: string[]
  fix?: boolean
  quiet?: boolean
}) {
  if (!hasEslintConfig(directory)) {
    logger.error(
      "No eslint.config.js found. Add one that extends `@medusajs/eslint-plugin` to lint this project."
    )
    process.exit(1)
  }

  const patterns = paths?.length ? paths : ["."]

  let result
  try {
    result = await lintProject({
      cwd: directory,
      patterns,
      fix: fix ?? false,
      quiet: quiet ?? false,
      logger,
    })
  } catch (error) {
    const typedError = error instanceof Error ? error : new Error(String(error))
    logger.error(`Linting failed to run: ${typedError.message}`)
    process.exit(1)
  }

  // `eslint` not installed — lintProject already warned.
  if (!result) {
    process.exit(1)
  }

  if (result.errorCount > 0 || result.warningCount > 0) {
    process.stdout.write(result.formatted)
  }

  if (result.errorCount > 0) {
    logger.error(`Lint failed with ${result.errorCount} error(s).`)
    process.exit(1)
  }

  if (result.warningCount > 0) {
    logger.warn(`Lint produced ${result.warningCount} warning(s).`)
    return
  }

  logger.info("No lint issues found.")
}
