import { MEDUSA_CLI_PATH, MedusaAppLoader, Migrator } from "@medusajs/framework"
import { LinkLoader } from "@medusajs/framework/links"
import {
  ContainerRegistrationKeys,
  getResolvedPlugins,
  isDefined,
  mergePluginModules,
} from "@medusajs/framework/utils"
import { Logger, MedusaContainer } from "@medusajs/framework/types"
import { fork } from "child_process"
import path, { join } from "path"
import { initializeContainer } from "../../loaders"
import { isSearchModuleEnabled } from "../../loaders/search"
import { ensureDbExists, isPgstreamEnabled } from "../utils"
import { syncLinks } from "./sync-links"

const TERMINAL_SIZE = process.stdout.columns

const cliPath = path.resolve(MEDUSA_CLI_PATH, "..", "..", "cli.js")

/**
 * A low-level utility to migrate the database. This util should
 * never exit the process implicitly.
 */
export async function migrate({
  directory,
  skipLinks,
  skipScripts,
  skipSearch,
  executeAllLinks,
  executeSafeLinks,
  allOrNothing,
  concurrency,
  logger,
  container,
}: {
  directory: string
  skipLinks: boolean
  skipScripts: boolean
  skipSearch: boolean
  executeAllLinks: boolean
  executeSafeLinks: boolean
  allOrNothing?: boolean
  concurrency?: number
  logger: Logger
  container: MedusaContainer
}): Promise<boolean> {
  /**
   * Setup
   */

  await ensureDbExists(container)

  // If pgstream is enabled, force concurrency to 1
  const pgstreamEnabled = await isPgstreamEnabled(container)
  if (pgstreamEnabled) {
    concurrency = 1
  }

  if (isDefined(concurrency)) {
    process.env.DB_MIGRATION_CONCURRENCY = String(concurrency)
  }

  const medusaAppLoader = new MedusaAppLoader()
  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const plugins = await getResolvedPlugins(directory, configModule, true)
  mergePluginModules(configModule, plugins, directory)

  const linksSourcePaths = plugins.map((plugin) =>
    join(plugin.resolve, "links")
  )
  await new LinkLoader(linksSourcePaths, logger).load()

  /**
   * Run migrations
   */
  logger.info("Running migrations...")

  const migrator = new Migrator({ container })
  await migrator.ensureMigrationsTable()

  await medusaAppLoader.runModulesMigrations({
    action: "run",
    allOrNothing,
  })
  logger.log(new Array(TERMINAL_SIZE).join("-"))
  logger.info("Migrations completed")

  /**
   * Sync links
   */
  if (!skipLinks) {
    logger.log(new Array(TERMINAL_SIZE).join("-"))
    await syncLinks(medusaAppLoader, {
      executeAll: executeAllLinks,
      executeSafe: executeSafeLinks,
      directory,
      container,
      concurrency,
    })
  }

  /**
   * Create and alter search indexes
   *
   * Runs in a child process because it needs a fully loaded app — this one only
   * ever loads modules far enough to plan migrations — and before the migration
   * scripts, whose boot is the first thing that can seed what this creates.
   */
  if (!skipSearch && isSearchModuleEnabled(configModule)) {
    const exitCode = await runCliCommand("db:migrate:search", directory)

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
    await runCliCommand("db:migrate:scripts", directory)
  }

  return true
}

async function runCliCommand(
  command: string,
  directory: string
): Promise<number> {
  const childProcess = fork(cliPath, [command], {
    cwd: directory,
    env: process.env,
  })

  return await new Promise<number>((resolve, reject) => {
    childProcess.on("error", (error) => {
      reject(error)
    })
    // A signal leaves the code null, which is not a success either.
    childProcess.on("close", (code) => {
      resolve(code ?? 1)
    })
  })
}

const main = async function ({
  directory,
  skipLinks,
  skipScripts,
  skipSearch,
  executeAllLinks,
  executeSafeLinks,
  concurrency,
  allOrNothing,
}) {
  process.env.MEDUSA_WORKER_MODE = "server"
  let logger: Logger | undefined

  try {
    const container = await initializeContainer(directory)
    logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    const migrated = await migrate({
      directory,
      skipLinks,
      skipScripts,
      skipSearch,
      executeAllLinks,
      executeSafeLinks,
      concurrency,
      allOrNothing,
      logger,
      container,
    })
    process.exit(migrated ? 0 : 1)
  } catch (error) {
    if (logger) {
      logger.error(error as string | Error)
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

export default main
