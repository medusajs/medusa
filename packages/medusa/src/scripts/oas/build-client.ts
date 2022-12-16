import path from "path"
import { generate, HttpClient, Indent } from "openapi-typescript-codegen"
import { upperFirst } from "lodash"
import { mkdir, readFile } from "fs/promises"
import logger from "../../loaders/logger"

type ApiType = "store" | "admin"
type OAS = Record<string, unknown>

const cliParams = process.argv.slice(2)
const isVerbose = cliParams.includes("--verbose") || cliParams.includes("-V")
const debug = (...args) => {
  if (isVerbose) {
    logger.debug(...args)
  }
}

// Current package root directory
const packagePath = path.resolve(__dirname, "../../../")

const run = async () => {
  debug("Generate Client from OAS.")

  const targetPackageSrcDir = path.resolve(packagePath, "../medusa-client/src")
  await mkdir(targetPackageSrcDir, { recursive: true })

  for (const apiType of ["store", "admin"]) {
    debug(`Building Client for ${apiType} api.`)
    const oas = await getOASFromFile(apiType as ApiType)
    await generateClientSDK(oas, apiType as ApiType, targetPackageSrcDir)
  }

  debug("Client successfully generated.")
}

const getOASFromFile = async (apiType: ApiType): Promise<OAS> => {
  const jsonFile = path.resolve(packagePath, `oas/${apiType}.oas.json`)
  const jsonString = await readFile(jsonFile, "utf8")
  return JSON.parse(jsonString)
}

const generateClientSDK = async (
  oas: OAS,
  apiType: ApiType,
  targetPackageSrcDir: string
) => {
  await generate({
    input: oas,
    output: path.resolve(targetPackageSrcDir, apiType),
    httpClient: HttpClient.AXIOS,
    useOptions: true,
    useUnionTypes: true,
    exportCore: true,
    exportServices: true,
    exportModels: true,
    exportHooks: true,
    exportSchemas: true,
    indent: Indent.SPACE_2,
    postfixServices: "Service",
    postfixModels: "",
    clientName: `Medusa${upperFirst(apiType)}`,
    request: undefined,
  })
}

void (async () => {
  await run()
})()
