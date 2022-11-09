import path from "path"

/**
 * Attempts to resolve the config file in a given root directory.
 * @param {string} rootDir - the directory to find the config file in.
 * @param {string} configName - the name of the config file.
 * @return {object} an object containing the config module and its path as well as an error property if the config couldn't be loaded.
 */
function getConfigFile(rootDir, configName) {
  const configPath = path.join(rootDir, configName)
  let configFilePath = ``
  let configModule

  try {
    configFilePath = require.resolve(configPath)
    configModule = require(configFilePath)
  } catch (err) {
    return {
      error: err,
    }
  }

  return { configModule, configFilePath }
}

export default getConfigFile
