import { getConfigFile } from "medusa-core-utils"
import { handleConfigError } from "../loaders/config"
import { ConfigModule } from "../types/global"

export async function resolveConfigProperties(obj): Promise<ConfigModule> {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      await resolveConfigProperties(obj[key])
    }
    if (typeof obj[key] === "function") {
      obj[key] = await obj[key]()
    }
  }
  return obj
}

export async function asyncLoadConfig(
  rootDir?: string,
  filename?: string
): Promise<ConfigModule> {
  let rootDirectory = rootDir
  if (process.env.NODE_ENV == "test" && !rootDir && !filename) {
    rootDirectory = `${__dirname}/__fixtures__/`
    filename = "default-case-non-async-data-postgres"
  }

  const configuration = getConfigFile(
    rootDirectory ?? process.cwd(),
    filename ?? `medusa-config`
  ) as {
    configModule: ConfigModule
    configFilePath: string
    error?: Error
  }
  if (configuration.error) {
    handleConfigError(configuration.error)
    throw new Error("config module load error")
  }
  const configModule = await resolveConfigProperties(configuration.configModule)
  return configModule
}
