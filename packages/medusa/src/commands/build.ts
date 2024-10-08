import path from "path"
import { rm } from "node:fs/promises"
import type tsStatic from "typescript"
import { logger } from "@medusajs/framework/logger"
import { ConfigModule } from "@medusajs/framework/types"
import { getConfigFile } from "@medusajs/framework/utils"

const ADMIN_FOLDER = "src/admin"
const INTEGRATION_TESTS_FOLDER = "integration-tests"

/**
 * Removes the directory and its children recursively and
 * ignores any errors
 */
async function clean(path: string) {
  await rm(path, { recursive: true }).catch(() => {})
}

/**
 * Loads the medusa config file or exits with an error
 */
function loadMedusaConfig(directory: string) {
  /**
   * Parsing the medusa config file to ensure it is error
   * free
   */
  const { configModule, configFilePath, error } = getConfigFile<ConfigModule>(
    directory,
    "medusa-config"
  )
  if (error) {
    console.error(`Failed to load medusa-config.js`)
    console.error(error)
    return
  }

  return { configFilePath, configModule }
}

/**
 * Parses the tsconfig file or exits with an error in case
 * the file is invalid
 */
function parseTSConfig(projectRoot: string, ts: typeof tsStatic) {
  let tsConfigErrors: null | tsStatic.Diagnostic = null

  const tsConfig = ts.getParsedCommandLineOfConfigFile(
    path.join(projectRoot, "tsconfig.json"),
    {
      inlineSourceMap: true,
      excludes: [],
    },
    {
      ...ts.sys,
      useCaseSensitiveFileNames: true,
      getCurrentDirectory: () => projectRoot,
      onUnRecoverableConfigFileDiagnostic: (error) => (tsConfigErrors = error),
    }
  )

  if (tsConfigErrors) {
    const compilerHost = ts.createCompilerHost({})
    console.error(
      ts.formatDiagnosticsWithColorAndContext([tsConfigErrors], compilerHost)
    )
    return
  }

  if (tsConfig!.errors.length) {
    const compilerHost = ts.createCompilerHost({})
    console.error(
      ts.formatDiagnosticsWithColorAndContext(tsConfig!.errors, compilerHost)
    )
    return
  }

  return tsConfig!
}

/**
 * Builds the backend project using TSC
 */
async function buildBackend(projectRoot: string): Promise<boolean> {
  logger.info("Compiling backend source...")

  const ts = await import("typescript")
  const tsConfig = parseTSConfig(projectRoot, ts)
  if (!tsConfig) {
    logger.error("Unable to compile backend source")
    return false
  }

  const distFolder = tsConfig.options.outDir ?? "build"
  const dist = path.isAbsolute(distFolder)
    ? distFolder
    : path.join(projectRoot, distFolder)

  logger.info(`Removing existing "${path.relative(projectRoot, dist)}" folder`)
  await clean(dist)

  /**
   * Ignoring admin and integration tests from the compiled
   * files
   */
  const filesToCompile = tsConfig.fileNames.filter((fileName) => {
    return (
      !fileName.includes(`${ADMIN_FOLDER}/`) &&
      !fileName.includes(`${INTEGRATION_TESTS_FOLDER}/`)
    )
  })

  const program = ts.createProgram(filesToCompile, {
    ...tsConfig.options,
    ...{
      /**
       * Disable inline source maps when the user has enabled
       * source maps within the config file
       */
      inlineSourceMap: !tsConfig.options.sourceMap,
    },
  })
  const emitResult = program.emit()
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)

  /**
   * Log errors (if any)
   */
  if (diagnostics.length) {
    console.error(
      ts.formatDiagnosticsWithColorAndContext(
        diagnostics,
        ts.createCompilerHost({})
      )
    )
  }

  if (emitResult.emitSkipped) {
    logger.warn("Backend build completed without emitting any output")
    return false
  }

  if (diagnostics.length) {
    logger.warn("Backend build completed with errors")
  } else {
    logger.info("Backend build completed successfully")
  }

  return true
}

/**
 * Builds the frontend project using the "@medusajs/admin-bundler"
 */
async function buildFrontend(projectRoot: string): Promise<boolean> {
  const configFile = loadMedusaConfig(projectRoot)
  if (!configFile) {
    return false
  }

  const adminSource = path.join(projectRoot, ADMIN_FOLDER)
  const adminOptions = {
    disable: false,
    path: "/app" as const,
    outDir: "./dist",
    sources: [adminSource],
    ...configFile.configModule.admin,
  }

  if (adminOptions.disable) {
    return false
  }

  try {
    logger.info("Compiling frontend source...")
    const { build: buildProductionBuild } = await import(
      "@medusajs/admin-bundler"
    )
    await buildProductionBuild(adminOptions)
    logger.info("Frontend build completed successfully")
    return true
  } catch (error) {
    logger.error("Unable to compile frontend source")
    console.error(error)
    return false
  }
}

export default async function ({ directory }: { directory: string }) {
  console.log("Starting build...")
  await Promise.all([buildBackend(directory), buildFrontend(directory)])
}
