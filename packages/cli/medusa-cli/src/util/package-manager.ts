// @ts-ignore
import ConfigStore from "configstore"
import reporter from "../reporter"

const config = new ConfigStore(
  `medusa`,
  {
    cli: {
      packageManager: "pnpm",
    },
  },
  { globalConfigPath: true }
)

const packageMangerConfigKey = `cli.packageManager`

export const getPackageManager = () => {
  return config.get(packageMangerConfigKey) as string
}

export const setPackageManager = (packageManager) => {
  config.set(packageMangerConfigKey, packageManager)
  reporter.info(`Preferred package manager set to "${packageManager}"`)
}
