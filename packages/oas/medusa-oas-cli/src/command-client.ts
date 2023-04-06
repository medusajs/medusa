import path from "path"
import {
  generate,
  HttpClient,
  Indent,
  PackageNames,
} from "@medusajs/openapi-typescript-codegen"
import { upperFirst } from "lodash"
import fs, { mkdir, readFile } from "fs/promises"
import { OpenAPIObject } from "openapi3-ts"
import { Command, Option, OptionValues } from "commander"

/**
 * CLI Command declaration
 */
export const commandName = "client"
export const commandDescription = "Generate API clients from OAS."
export const commandOptions: Option[] = [
  new Option(
    "-t, --type <type>",
    "Namespace for the generated client. Usually `admin` or `store`."
  ).makeOptionMandatory(),

  new Option(
    "-s, --src-file <srcFile>",
    "Path to source OAS JSON file."
  ).makeOptionMandatory(),

  new Option(
    "-o, --out-dir <outDir>",
    "Output directory for generated client files."
  ).default(path.resolve(process.cwd(), "client")),

  new Option(
    "-c, --component <component>",
    "Client component types to generate."
  )
    .choices(["all", "types", "client", "hooks"])
    .default("all"),

  new Option(
    "--types-package <name>",
    "Replace relative import statements by types package name."
  ),

  new Option(
    "--client-package <name>",
    "Replace relative import statements by client package name."
  ),

  new Option(
    "--clean",
    "Delete destination directory content before generating client."
  ),
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
  if (
    ["client", "hooks"].includes(cliParams.component) &&
    !cliParams.typesPackage
  ) {
    throw new Error(
      `--types-package must be declared when using --component=${cliParams.component}`
    )
  }
  if (cliParams.component === "hooks" && !cliParams.clientPackage) {
    throw new Error(
      `--client-package must be declared when using --component=${cliParams.component}`
    )
  }

  const shouldClean = !!cliParams.clean
  const srcFile = path.resolve(cliParams.srcFile)
  const outDir = path.resolve(cliParams.outDir)
  const apiName = cliParams.type
  const packageNames: PackageNames = {
    models: cliParams.typesPackage,
    client: cliParams.clientPackage,
  }
  const exportComponent = cliParams.component

  /**
   * Command execution
   */
  console.log(`🟣 Generating client - ${apiName} - ${exportComponent}`)

  if (shouldClean) {
    console.log(`🟠 Cleaning output directory`)
    await fs.rm(outDir, { recursive: true, force: true })
  }
  await mkdir(outDir, { recursive: true })

  const oas = await getOASFromFile(srcFile)
  await generateClientSDK(oas, outDir, apiName, exportComponent, packageNames)

  console.log(
    `🟢 Client generated - ${apiName} - ${exportComponent} - ${outDir}`
  )
}

/**
 * Methods
 */
const getOASFromFile = async (jsonFile: string): Promise<OpenAPIObject> => {
  const jsonString = await readFile(jsonFile, "utf8")
  return JSON.parse(jsonString)
}

const generateClientSDK = async (
  oas: OpenAPIObject,
  targetDir: string,
  apiName: string,
  exportComponent: "all" | "types" | "client" | "hooks",
  packageNames: PackageNames = {}
) => {
  const exports = {
    exportCore: false,
    exportServices: false,
    exportModels: false,
    exportHooks: false,
  }

  switch (exportComponent) {
    case "types":
      exports.exportModels = true
      break
    case "client":
      exports.exportCore = true
      exports.exportServices = true
      break
    case "hooks":
      exports.exportHooks = true
      break
    default:
      exports.exportCore = true
      exports.exportServices = true
      exports.exportModels = true
      exports.exportHooks = true
  }

  await generate({
    input: oas,
    output: targetDir,
    httpClient: HttpClient.AXIOS,
    useOptions: true,
    useUnionTypes: true,
    exportCore: exports.exportCore,
    exportServices: exports.exportServices,
    exportModels: exports.exportModels,
    exportHooks: exports.exportHooks,
    exportSchemas: false,
    indent: Indent.SPACE_2,
    postfixServices: "Service",
    postfixModels: "",
    clientName: `Medusa${upperFirst(apiName)}`,
    request: undefined,
    packageNames,
  })
}
