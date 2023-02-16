import * as path from "path"
import { lstat, mkdir, writeFile } from "fs/promises"
import swaggerInline from "swagger-inline"
import OpenAPIParser from "@readme/openapi-parser"
import { OpenAPIObject } from "openapi3-ts"
import { Command, Option, OptionValues } from "commander"

/**
 * Constants
 */
// Medusa core package directory
const medusaPackagePath = path.dirname(
  require.resolve("@medusajs/medusa/package.json")
)

type ApiType = "store" | "admin"

/**
 * CLI Command declaration
 */
export const commandName = "oas"
export const commandDescription =
  "Compile full OAS from swagger-inline compliant JSDoc."

export const commandOptions: Option[] = [
  new Option("-t, --type <type>", "API type to compile []")
    .choices(["all", "admin", "store"])
    .default("all"),
  new Option(
    "-o, --out-dir <outDir>",
    "Destination directory to output generated OAS files."
  ).default(process.cwd()),
  new Option("-D, --dry-run", "Do not output files."),
  new Option(
    "-p, --paths <paths...>",
    "Additional paths to crawl for OAS JSDoc."
  ),
  new Option("-F, --force", "Ignore OAS validation and output OAS files."),
]

export function getCommand() {
  const command = new Command(commandName)
  command.description(commandDescription)
  for (const opt of commandOptions) {
    command.addOption(opt)
  }
  command.action(async (options) => await execute(options))
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

  const apiTypesToExport =
    cliParams.type === "all" ? ["store", "admin"] : [cliParams.type]

  const outDir = path.resolve(cliParams.outDir)

  const additionalPaths = (cliParams.paths ?? []).map((additionalPath) =>
    path.resolve(additionalPath)
  )
  for (const additionalPath of additionalPaths) {
    if (!(await isDirectory(additionalPath))) {
      throw new Error(`--paths must be a directory - ${additionalPath}`)
    }
  }

  /**
   * Command execution
   */
  if (!dryRun) {
    await mkdir(outDir, { recursive: true })
  }

  for (const apiType of apiTypesToExport) {
    console.log(`🟣 Generating OAS - ${apiType}`)
    const oas = await getOASFromCodebase(apiType as ApiType, additionalPaths)
    await validateOAS(oas, apiType as ApiType, force)
    if (!dryRun) {
      await exportOASToJSON(oas, apiType as ApiType, outDir)
    }
  }
}

/**
 * Methods
 */
async function getOASFromCodebase(
  apiType: ApiType,
  additionalPaths: string[] = []
): Promise<OpenAPIObject> {
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

  return await OpenAPIParser.parse(JSON.parse(gen))
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
  console.log(`🔵 Exported OAS - ${apiType} - ${filePath}`)
}

async function isDirectory(dirPath: string): Promise<boolean> {
  return (await lstat(path.resolve(dirPath))).isDirectory()
}
