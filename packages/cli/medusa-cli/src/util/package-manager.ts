import ConfigStore from "configstore"
import reporter from "../reporter"

const config = new ConfigStore(`medusa`, {}, { globalConfigPath: true })

const packageMangerConfigKey = `cli.packageManager`

export const getPackageManager = () => {
  return config.get(packageMangerConfigKey)
}

export const setPackageManager = (packageManager) => {
  config.set(packageMangerConfigKey, packageManager)
  reporter.info(`Preferred package manager set to "${packageManager}"`)
}
