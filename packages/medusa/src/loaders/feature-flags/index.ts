import path from "path"
import glob from "glob"

import { FlagSettings } from "../../types/feature-flags"
import { FlagRouter } from "../../utils/flag-router"
import { Logger } from "../../types/global"

const isTruthy = (val: string | boolean | undefined): boolean => {
  if (typeof val === "string") {
    return val.toLowerCase() === "true"
  }
  return !!val
}

export default (
  configModule: { featureFlags?: Record<string, string | boolean> } = {},
  logger?: Logger,
  flagDirectory?: string
): FlagRouter => {
  const { featureFlags: projectConfigFlags = {} } = configModule

  const flagDir = path.join(flagDirectory || __dirname, "*.js")
  const supportedFlags = glob.sync(flagDir, {
    ignore: ["**/index.js"],
  })

  const flagConfig: Record<string, boolean> = {}
  for (const flag of supportedFlags) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const importedModule = require(flag)
    if (!importedModule.default) {
      continue
    }

    const flagSettings: FlagSettings = importedModule.default

    switch (true) {
      case typeof process.env[flagSettings.env_key] !== "undefined":
        if (logger) {
          logger.info(
            `Using flag ${flagSettings.env_key} from environment with value ${
              process.env[flagSettings.env_key]
            }`
          )
        }
        flagConfig[flagSettings.key] = isTruthy(
          process.env[flagSettings.env_key]
        )
        break
      case typeof projectConfigFlags[flagSettings.key] !== "undefined":
        if (logger) {
          logger.info(
            `Using flag ${flagSettings.key} from project config with value ${
              projectConfigFlags[flagSettings.key]
            }`
          )
        }
        flagConfig[flagSettings.key] = isTruthy(
          projectConfigFlags[flagSettings.key]
        )
        break
      default:
        flagConfig[flagSettings.key] = flagSettings.default_val
    }
  }

  return new FlagRouter(flagConfig)
}
