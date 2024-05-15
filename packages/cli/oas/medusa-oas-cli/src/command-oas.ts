import OpenAPIParser from "@readme/openapi-parser"
import { Command, Option, OptionValues } from "commander"
import { lstat, mkdir, writeFile } from "fs/promises"
import { OpenAPIObject } from "openapi3-ts"
import * as path from "path"
import swaggerInline from "swagger-inline"
import { combineOAS } from "./utils/combine-oas"
import {
  mergeBaseIntoOAS,
  mergePathsAndSchemasIntoOAS,
} from "./utils/merge-oas"
import { isFile } from "./utils/fs-utils"

/**
 * Constants
 */
// Medusa core package directory
const medusaPackagePath = path.dirname(
  require.resolve("@medusajs/medusa/package.json")
)
const basePath = path.resolve(__dirname, "../")

/**
 * CLI Command declaration
 */
export const commandName = "oas"
export const commandDescription =
  "Compile full OAS from swagger-inline compliant JSDoc."

export const commandOptions: Option[] = [
  new Option("-t, --type <type>", "API type to compile.")
    .choices(["admin", "store", "combined"])
    .makeOptionMandatory(),
  new Option(
    "-o, --out-dir <outDir>",
    "Destination directory to output generated OAS files."
  ).default(process.cwd()),
  new Option("-D, --dry-run", "Do not output files."),
  new Option(
    "-p, --paths <paths...>",
    "Additional paths to crawl for OAS JSDoc."
  ),
  new Option(
    "-b, --base <base>",
    "Custom base OAS file to use for swagger-inline."
  ),
  new Option("-F, --force", "Ignore OAS validation and output OAS files."),
  new Option(
    "--local",
    "Generate OAS from local files rather than public OAS. This is useful for generating references in the Medusa monorepo."
  )
]

export function getCommand() {
  const command = new Command(commandName)
  command.description(commandDescription)
  for (const opt of commandOptions) {
    command.addOption(opt)
  }
  command.action(async (options) => await execute(options))
  command.showHelpAfterError(true)
  return command
}

/**
 * Main
 */
export async function execute(cliParams: OptionValues) {
  /**
   * Process CLI options
   */
  const dryRun = !!cliParams.dryRun
  const force = !!cliParams.force
  const v2 = !!cliParams.v2
  const local = !!cliParams.local

  const apiType: ApiType = cliParams.type

  const outDir = path.resolve(cliParams.outDir)

  const additionalPaths = (cliParams.paths ?? []).map((additionalPath) =>
    path.resolve(additionalPath)
  )
  for (const additionalPath of additionalPaths) {
    if (!(await isDirectory(additionalPath))) {
      throw new Error(`--paths must be a directory - ${additionalPath}`)
    }
  }

  const baseFile = cliParams.base ? path.resolve(cliParams.base) : undefined
  if (baseFile) {
    if (!(await isFile(cliParams.base))) {
      throw new Error(`--base must be a file - ${baseFile}`)
    }
  }

  /**
   * Command execution
   */
  if (!dryRun) {
    await mkdir(outDir, { recursive: true })
  }

  let oas: OpenAPIObject
  console.log(`🟣 Generating OAS - ${apiType}`)

  if (apiType === "combined") {
    const adminOAS = !local ? await getPublicOas("admin") :  await getOASFromCodebase("admin")
    const storeOAS = !local ? await getPublicOas("store") :  await getOASFromCodebase("store")
    oas = await combineOAS(adminOAS, storeOAS)
  } else {
    oas = !local ? await getPublicOas(apiType) :  await getOASFromCodebase(apiType)
  }

  if (additionalPaths.length || baseFile) {
    const customOAS = await getOASFromPaths(additionalPaths, baseFile)
    if (baseFile) {
      mergeBaseIntoOAS(oas, customOAS)
    }
    if (additionalPaths.length) {
      mergePathsAndSchemasIntoOAS(oas, customOAS)
    }
  }

  await validateOAS(oas, apiType, force)
  if (dryRun) {
    console.log(`⚫️ Dry run - no files generated`)
    return
  }
  await exportOASToJSON(oas, apiType, outDir)
}

/**
 * Methods
 */
async function getOASFromCodebase(
  apiType: ApiType
): Promise<OpenAPIObject> {
  /**
   * OAS output directory
   */
  const oasOutputPath = path.resolve(
    __dirname, "..", "..", "..", "..", "..", "www", "utils", "generated", "oas-output"
  )
  const gen = await swaggerInline(
    [
      path.resolve(oasOutputPath, "operations", apiType),
      path.resolve(oasOutputPath, "schemas"),
      // We currently load error schemas from here. If we change
      // that in the future, we should change the path.
      path.resolve(medusaPackagePath, "dist", "utils/middlewares"),
    ],
    {
      base: path.resolve(oasOutputPath, "base", `${apiType}.oas.base.yaml`),
      format: ".json",
    }
  )
  return (await OpenAPIParser.parse(JSON.parse(gen))) as OpenAPIObject
}

async function getPublicOas(
  apiType: ApiType,
) {
  const url = `https://docs.medusajs.com/v2/api/download/${apiType}`
  return await OpenAPIParser.parse(url) as OpenAPIObject
}

async function getOASFromPaths(
  additionalPaths: string[] = [],
  customBaseFile?: string
): Promise<OpenAPIObject> {
  console.log(`🔵 Gathering custom OAS`)
  const gen = await swaggerInline(additionalPaths, {
    base:
      customBaseFile ?? path.resolve(basePath, "oas", "default.oas.base.yaml"),
    format: ".json",
    logger: (log) => {
      console.log(log)
    },
  })
  return (await OpenAPIParser.parse(JSON.parse(gen))) as OpenAPIObject
}

async function validateOAS(
  oas: OpenAPIObject,
  apiType: ApiType,
  force = false
): Promise<void> {
  try {
    await OpenAPIParser.validate(JSON.parse(JSON.stringify(oas)))
    console.log(`🟢 Valid OAS - ${apiType}`)
  } catch (err) {
    console.error(`🔴 Invalid OAS - ${apiType}`, err)
    if (!force) {
      process.exit(1)
    }
  }
}

async function exportOASToJSON(
  oas: OpenAPIObject,
  apiType: ApiType,
  targetDir: string
): Promise<void> {
  const json = JSON.stringify(oas, null, 2)
  const filePath = path.resolve(targetDir, `${apiType}.oas.json`)
  await writeFile(filePath, json)
  console.log(`⚫️ Exported OAS - ${apiType} - ${filePath}`)
}

async function isDirectory(dirPath: string): Promise<boolean> {
  try {
    return (await lstat(path.resolve(dirPath))).isDirectory()
  } catch (err) {
    console.log(err)
    return false
  }
}
