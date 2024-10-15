import { join } from "path"
import { resolveExports } from "./resolve-exports"

/**
 * Attempts to resolve the config file in a given root directory.
 * @param {string} rootDir - the directory to find the config file in.
 * @param {string} configName - the name of the config file.
 * @return {object} an object containing the config module and its path as well as an error property if the config couldn't be loaded.
 */
export function getConfigFile<TConfig = unknown>(
  rootDir: string,
  configName: string
):
  | { configModule: null; configFilePath: string; error: Error }
  | { configModule: TConfig; configFilePath: string; error: null } {
  const configPath = join(rootDir, configName)

  try {
    const configFilePath = require.resolve(configPath)
    const configExports = require(configFilePath)
    const resolvedExports = resolveExports(configExports)
    return {
      configModule:
        "default" in resolvedExports && resolvedExports.default
          ? resolvedExports.default
          : resolvedExports,
      configFilePath,
      error: null,
    }
  } catch (e) {
    return {
      configModule: null,
      configFilePath: "",
      error: e,
    }
  }
}
