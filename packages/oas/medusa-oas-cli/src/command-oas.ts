import * as path from "path"
import { mkdir, writeFile } from "fs/promises"
import swaggerInline from "swagger-inline"
import OpenAPIParser from "@readme/openapi-parser"
import logger from "@medusajs/medusa-cli/dist/reporter"
import { OpenAPIObject } from "openapi3-ts"
import { Command, Option } from "commander"

// Medusa core package directory
const medusaPackagePath = path.dirname(
  require.resolve("@medusajs/medusa/package.json")
)

type ApiType = "store" | "admin"

export const commandDescription =
  "Compile full OAS from swagger-inline compliant JSDoc."

export const commandOptions: Option[] = [
  new Option("-t, --type <type>", "API type to compile []")
    .choices(["all", "admin", "store"])
    .default("all"),
  new Option("-V, --verbose", "Output debug logs to stdout."),
  new Option("-D, --dryRun", "Do not output files."),
  new Option(
    "-p, --additionalPaths <paths...>",
    "Additional paths to crawl for OAS JSDoc."
  ),
  new Option(
    "-o, --outDir <outDir>",
    "Destination directory to output generated OAS files."
  ).default(process.cwd()),
]

const program = new Command()
program.description(commandDescription)
for (const opt of commandOptions) {
  program.addOption(opt)
}
program.parse(process.argv)

/**
 * Process CLI options
 */
const cliParams = program.opts()

const dryRun = !!cliParams.dryRun
const isVerbose = !!cliParams.verbose
const outDir = path.resolve(cliParams.outDir)

const additionalPaths = (cliParams.additionalPaths ?? []).map(
  (additionalPath) => path.dirname(path.resolve(additionalPath))
)

const apiTypesToExport =
  cliParams.type === "all" ? ["store", "admin"] : [cliParams.type]

const debug = (...args) => {
  if (isVerbose) {
    logger.debug(...args)
  }
}

const run = async () => {
  debug("🔵 Generating OAS from codebase.")
  if (!dryRun) {
    await mkdir(outDir, { recursive: true })
  }

  for (const apiType of apiTypesToExport) {
    debug(`🟣 Building OAS for ${apiType} api.`)
    const oas = await getOASFromCodebase(apiType as ApiType)
    await validateOAS(oas, apiType as ApiType, dryRun)
    if (!dryRun) {
      await exportOASToJSON(oas, apiType as ApiType, outDir)
    }
  }

  debug(`🟢 OAS successfully generated.`)
}

const getOASFromCodebase = async (apiType: ApiType): Promise<OpenAPIObject> => {
  debug("Parse JSDoc from path and schema definitions.")
  const gen = await swaggerInline(
    [
      path.resolve(medusaPackagePath, "dist", "models"),
      path.resolve(medusaPackagePath, "dist", "types"),
      path.resolve(medusaPackagePath, "dist", "api/middlewares"),
      path.resolve(medusaPackagePath, "dist", `api/routes/${apiType}`),
      ...additionalPaths,
    ],
    {
      base: path.resolve(
        medusaPackagePath,
        "oas",
        `${apiType}-spec3-base.yaml`
      ),
      format: ".json",
    }
  )

  debug("Get OAS JSON object from OAS JSON string.")
  return await OpenAPIParser.parse(JSON.parse(gen))
}

const validateOAS = async (
  oas: OpenAPIObject,
  apiType: ApiType,
  shouldThrow = false
): Promise<void> => {
  debug("Validate generated OAS.")
  try {
    await OpenAPIParser.validate(JSON.parse(JSON.stringify(oas)))
  } catch (err) {
    if (shouldThrow) {
      logger.error(`Error in OAS ${apiType}`, err)
      process.exit(1)
    } else {
      debug("OAS validation failed.")
      logger.warn(err)
    }
  }
}

const exportOASToJSON = async (
  oas: OpenAPIObject,
  apiType: ApiType,
  targetDir: string
): Promise<void> => {
  debug("Exporting OAS to JSON.")
  const json = JSON.stringify(oas, null, 2)
  await writeFile(path.resolve(targetDir, `${apiType}.oas.json`), json)
}

void (async () => {
  await run()
})()
