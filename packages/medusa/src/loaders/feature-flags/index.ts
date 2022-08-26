import glob from "glob"
import path from "path"

import { trackFeatureFlag } from "medusa-telemetry"
import { FlagSettings } from "../../types/feature-flags"
import { Logger } from "../../types/global"
import { FlagRouter } from "../../utils/flag-router"
import { isDefined } from "../../utils"

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

  const flagDir = path.join(flagDirectory || __dirname, "*.{j,t}s")
  const supportedFlags = glob.sync(flagDir, {
    ignore: ["**/index.js", "**/index.ts", "**/*.d.ts"],
  })

  const flagConfig: Record<string, boolean> = {}
  for (const flag of supportedFlags) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const flagSettings: FlagSettings = require(flag).default
    if (!flagSettings) {
      continue
    }

    flagConfig[flagSettings.key] = isTruthy(flagSettings.default_val)

    let from
    if (isDefined(process.env[flagSettings.env_key])) {
      from = "environment"
      flagConfig[flagSettings.key] = isTruthy(process.env[flagSettings.env_key])
    } else if (isDefined(projectConfigFlags[flagSettings.key])) {
      from = "project config"
      flagConfig[flagSettings.key] = isTruthy(
        projectConfigFlags[flagSettings.key]
      )
    }

    if (logger && from) {
      logger.info(
        `Using flag ${flagSettings.env_key} from ${from} with value ${
          flagConfig[flagSettings.key]
        }`
      )
    }

    if (flagConfig[flagSettings.key]) {
      trackFeatureFlag(flagSettings.key)
    }
  }

  return new FlagRouter(flagConfig)
}
