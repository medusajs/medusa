import { PreviewDocsOptions, previewDocs } from "@redocly/cli/lib/commands/preview-docs"
import { commandWrapper } from "@redocly/cli/lib/wrapper"
import { Command, Option, OptionValues } from "commander"
import execa from "execa"
import fs, { mkdir } from "fs/promises"
import { isArray, mergeWith } from "lodash"
import * as path from "path"
import {
  formatHintRecommendation,
  getCircularPatchRecommendation,
  getCircularReferences,
} from "./utils/circular-patch-utils"
import { getTmpDirectory, isFile } from "./utils/fs-utils"
import { readJson } from "./utils/json-utils"
import { jsonFileToYamlFile, readYaml, writeYaml, writeYamlFromJson } from "./utils/yaml-utils"
import yargs from "yargs"

/**
 * Constants
 */
const basePath = path.resolve(__dirname, "../")

const medusaPluginRelativePath = "./plugins/medusa/index.js"
const medusaPluginAbsolutePath = path.resolve(
  basePath,
  "redocly/plugins/medusa/index.js"
)
const configFileDefault = path.resolve(basePath, "redocly/redocly-config.yaml")

/**
 * CLI Command declaration
 */
export const commandName = "docs"
export const commandDescription =
  "Sanitize OAS for use with Redocly's API documentation viewer."

export const commandOptions: Option[] = [
  new Option(
    "-s, --src-file <srcFile>",
    "Path to source OAS JSON file."
  ).makeOptionMandatory(),
  new Option(
    "-o, --out-dir <outDir>",
    "Destination directory to output the sanitized OAS files."
  ).default(process.cwd()),
  new Option(
    "--config <config>",
    "Configuration file to merge with default configuration before passing to Redocly's CLI."
  ),
  new Option("-D, --dry-run", "Do not output files."),
  new Option(
    "--clean",
    "Delete destination directory content before generating documentation."
  ),
  new Option("--split", "Creates a multi-file structure output."),
  new Option(
    "--preview",
    "Open a preview of the documentation. Does not output files."
  ),
  new Option(
    "--html",
    "Generate a static HTML using Redocly's build-docs command."
  ),
  new Option(
    "--main-file-name <mainFileName>",
    "The name of the main YAML file."
  ).default("openapi.yaml")
]

export function getCommand(): Command {
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
export async function execute(cliParams: OptionValues): Promise<void> {
  /**
   * Process CLI options
   */
  const shouldClean = !!cliParams.clean
  const shouldSplit = !!cliParams.split
  const shouldPreview = !!cliParams.preview
  const shouldBuildHTML = !!cliParams.html
  const dryRun = !!cliParams.dryRun
  const srcFile = path.resolve(cliParams.srcFile)
  const outDir = path.resolve(cliParams.outDir)

  const configFileCustom = cliParams.config
    ? path.resolve(cliParams.config)
    : undefined
  if (configFileCustom) {
    if (!(await isFile(configFileCustom))) {
      throw new Error(`--config must be a file - ${configFileCustom}`)
    }
    if (![".json", ".yaml"].includes(path.extname(configFileCustom))) {
      throw new Error(
        `--config file must be of type .json or .yaml - ${configFileCustom}`
      )
    }
  }

  /**
   * Command execution
   */
  console.log(`🟣 Generating API documentation`)

  const tmpDir = await getTmpDirectory()
  const configTmpFile = path.resolve(tmpDir, "redocly-config.yaml")
  /** matches naming convention from `redocly split` */
  const finalOASFile = cliParams.mainFileName

  await createTmpConfig(configFileDefault, configTmpFile)
  if (configFileCustom) {
    console.log(
      `🔵 Merging configuration file - ${configFileCustom} > ${configTmpFile}`
    )
    await mergeConfig(configTmpFile, configFileCustom, configTmpFile)
  }

  if (!dryRun) {
    if (shouldClean) {
      console.log(`🟠 Cleaning output directory`)
      await fs.rm(outDir, { recursive: true, force: true })
    }
    await mkdir(outDir, { recursive: true })
  }

  const srcFileSanitized = path.resolve(tmpDir, "tmp.oas.yaml")
  await sanitizeOAS(srcFile, srcFileSanitized, configTmpFile)
  await circularReferenceCheck(srcFileSanitized)

  if (dryRun) {
    console.log(`⚫️ Dry run - no files generated`)
    return
  }
  if (shouldPreview) {
    await preview(srcFileSanitized, configTmpFile)
    return
  }
  if (shouldSplit) {
    await generateReference(srcFileSanitized, outDir)
  } else {
    await writeYaml(path.join(outDir, finalOASFile), await fs.readFile(srcFileSanitized, "utf8"))
  }
  if (shouldBuildHTML) {
    const outHTMLFile = path.resolve(outDir, "index.html")
    await buildHTML(finalOASFile, outHTMLFile, configTmpFile)
  }
  console.log(`⚫️ API documentation generated - ${outDir}`)
}

/**
 * Methods
 */
type RedoclyConfig = {
  apis?: Record<string, unknown>
  decorators?: Record<string, unknown>
  extends?: string[]
  organization?: string
  plugins?: string[]
  preprocessors?: Record<string, unknown>
  region?: string
  resolve?: Record<string, unknown>
  rules?: Record<string, unknown>
  theme?: Record<string, unknown>
}

const mergeConfig = async (
  configFileDefault: string,
  configFileCustom: string,
  configFileOut: string
): Promise<void> => {
  const configDefault = await readYaml(configFileDefault)
  const configCustom =
    path.extname(configFileCustom) === ".yaml"
      ? await readYaml(configFileCustom)
      : await readJson(configFileCustom)

  const config = mergeWith(configDefault, configCustom, (objValue, srcValue) =>
    isArray(objValue) ? objValue.concat(srcValue) : undefined
  ) as RedoclyConfig

  await writeYamlFromJson(configFileOut, config)
}

const createTmpConfig = async (
  configFileDefault: string,
  configFileOut: string
): Promise<void> => {
  const config = (await readYaml(configFileDefault)) as RedoclyConfig
  config.plugins = (config.plugins ?? []).filter(
    (plugin) => plugin !== medusaPluginRelativePath
  )
  config.plugins.push(medusaPluginAbsolutePath)

  await writeYamlFromJson(configFileOut, config)
}

const sanitizeOAS = async (
  srcFile: string,
  outFile: string,
  configFile: string
): Promise<void> => {
  const { all: logs } = await execa(
    "yarn",
    [
      "redocly",
      "bundle",
      srcFile,
      `--output=${outFile}`,
      `--config=${configFile}`,
    ],
    { cwd: basePath, all: true }
  )
  console.log(logs)
}

const circularReferenceCheck = async (srcFile: string): Promise<void> => {
  const { circularRefs, oas } = await getCircularReferences(srcFile)
  if (circularRefs.length) {
    console.log(circularRefs)
    let errorMessage = `🔴 Unhandled circular references - Please manually patch using --config ./redocly-config.yaml`
    const recommendation = getCircularPatchRecommendation(circularRefs, oas)
    if (Object.keys(recommendation).length) {
      const hint = formatHintRecommendation(recommendation)
      errorMessage += `
Within redocly-config.yaml, try adding the following:
###
${hint}
###
`
    }
    throw new Error(errorMessage)
  }
  console.log(`🟢 All circular references are handled`)
}

const generateReference = async (
  srcFile: string,
  outDir: string
): Promise<void> => {
  const { all: logs } = await execa(
    "yarn",
    ["redocly", "split", srcFile, `--outDir=${outDir}`],
    { cwd: basePath, all: true }
  )
  console.log(logs)
}

const preview = async (oasFile: string, configFile: string): Promise<void> => {
  await commandWrapper(previewDocs)({
    port: 8080,
    host: "127.0.0.1",
    api: oasFile,
    config: configFile,
  } as yargs.Arguments<PreviewDocsOptions>)
}

const buildHTML = async (
  srcFile: string,
  outFile: string,
  configFile: string
): Promise<void> => {
  const { all: logs } = await execa(
    "yarn",
    [
      "redocly",
      "build-docs",
      srcFile,
      `--output=${outFile}`,
      `--config=${configFile}`,
      `--cdn=true`,
    ],
    { cwd: basePath, all: true }
  )
  console.log(logs)
}
