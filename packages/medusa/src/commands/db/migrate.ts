const exitCode = import { ConfigModule, Logger } from "@medusajs/types"
import {
  isSearchModuleEnabled,
  getResolvedExecutables,
  runCliCommand,
} from "../../utils/get-migrations"

const TERMINAL_SIZE = 78

export async function migrate(
  directory: string,
  configModule: ConfigModule,
  logger: Logger,
  options?: {
    skipSearch?: boolean
    skipScripts?: boolean
  }
): Promise<boolean> {
  const { skipSearch = false, skipScripts = false } = options || {}

  const executables = await getResolvedExecutables(directory)

  for (const executable of executables) {
    logger.log(new Array(TERMINAL_SIZE).join("-"))

    const exitCode = await runCliCommand(executable, directory)

    if (exitCode !== 0) {
      return false
    }
  }

  if (!skipSearch && isSearchModuleEnabled(configModule)) {
    const searchArgs = [
      ...(options?.skipSearch ? ["--skip-search"] : []),
    ]

    const exitCode = await runCliCommand(
      "db:migrate:search",
      directory,
      searchArgs
    )

    // Reported rather than swallowed: the seed at application start cannot tell a
    // half-migrated index from a fresh one, so this has to be seen now.
    if (exitCode !== 0) {
      return false
    }
  }

  if (!skipScripts) {
    /**
     * Run migration scripts
     */
    logger.log(new Array(TERMINAL_SIZE).join("-"))
    const exitCode = await runCliCommand("db:migrate:scripts", directory)
    if (exitCode !== 0) {
      return false
    }
  }

  return true
}
