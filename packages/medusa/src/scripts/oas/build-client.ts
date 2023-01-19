import path from "path"
import { generate, HttpClient, Indent } from "openapi-typescript-codegen"
import { upperFirst } from "lodash"
import fs, { mkdir, readFile } from "fs/promises"
import logger from "../../loaders/logger"
import { OpenAPIObject } from "openapi3-ts"

type ApiType = "store" | "admin"

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

  for (const apiType of ["store", "admin"]) {
    debug(`Building Client for ${apiType} api.`)
    const targetPackageSrcDir = path.resolve(
      packagePath,
      `../medusa-client-${apiType}/src/lib`
    )
    await fs.rm(targetPackageSrcDir, { recursive: true, force: true })
    await mkdir(targetPackageSrcDir, { recursive: true })

    const oas = await getOASFromFile(apiType as ApiType)
    await generateClientSDK(oas, apiType as ApiType, targetPackageSrcDir)
  }

  for (const apiType of ["store", "admin"]) {
    debug(`Building React for ${apiType} api.`)
    const targetPackageSrcDir = path.resolve(
      packagePath,
      `../medusa-react-${apiType}/src/lib`
    )
    await fs.rm(targetPackageSrcDir, { recursive: true, force: true })
    await mkdir(targetPackageSrcDir, { recursive: true })

    const oas = await getOASFromFile(apiType as ApiType)
    await generateClientSDK(oas, apiType as ApiType, targetPackageSrcDir)
  }

  debug("Client successfully generated.")
}

const getOASFromFile = async (apiType: ApiType): Promise<OpenAPIObject> => {
  const jsonFile = path.resolve(packagePath, `oas/${apiType}.oas.json`)
  const jsonString = await readFile(jsonFile, "utf8")
  return JSON.parse(jsonString)
}

const generateClientSDK = async (
  oas: OpenAPIObject,
  apiType: ApiType,
  targetPackageSrcDir: string
) => {
  await generate({
    input: oas,
    output: targetPackageSrcDir,
    httpClient: HttpClient.AXIOS,
    useOptions: true,
    useUnionTypes: true,
    exportCore: true,
    exportServices: true,
    exportModels: true,
    exportHooks: true,
    exportSchemas: false,
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
