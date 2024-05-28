import {
  FlagRouter,
  isObject,
  isString,
  objectFromStringPath,
} from "@medusajs/utils"
import glob from "glob"
import { isDefined } from "@medusajs/utils"
import { trackFeatureFlag } from "medusa-telemetry"
import path from "path"
import { FlagSettings } from "../../types/feature-flags"
import { Logger } from "../../types/global"

const isTruthy = (val: string | boolean | undefined): boolean => {
  if (typeof val === "string") {
    return val.toLowerCase() === "true"
  }
  return !!val
}

export const featureFlagRouter = new FlagRouter({})

export default (
  configModule: {
    featureFlags?: Record<string, string | boolean | Record<string, boolean>>
  } = {},
  logger?: Logger,
  flagDirectory?: string
): FlagRouter => {
  const { featureFlags: projectConfigFlags = {} } = configModule

  const flagDir = path.join(flagDirectory || __dirname, "*.{j,t}s")
  const supportedFlags = glob.sync(flagDir, {
    ignore: ["**/index.js", "**/index.ts", "**/*.d.ts"],
  })

  const flagConfig: Record<string, boolean | Record<string, boolean>> = {}
  for (const flag of supportedFlags) {
    const flagSettings: FlagSettings = require(flag).default
    if (!flagSettings) {
      continue
    }

    flagConfig[flagSettings.key] = isTruthy(flagSettings.default_val)

    let from
    if (isDefined(process.env[flagSettings.env_key])) {
      from = "environment"
      const envVal = process.env[flagSettings.env_key]

      // MEDUSA_FF_ANALYTICS="true"
      flagConfig[flagSettings.key] = isTruthy(process.env[flagSettings.env_key])

      const parsedFromEnv = isString(envVal) ? envVal.split(",") : []

      // MEDUSA_FF_WORKFLOWS=createProducts,deleteProducts
      if (parsedFromEnv.length > 1) {
        flagConfig[flagSettings.key] = objectFromStringPath(parsedFromEnv)
      }
    } else if (isDefined(projectConfigFlags[flagSettings.key])) {
      from = "project config"

      // featureFlags: { analytics: "true" | true }
      flagConfig[flagSettings.key] = isTruthy(
        projectConfigFlags[flagSettings.key] as string | boolean
      )

      // featureFlags: { workflows: { createProducts: true } }
      if (isObject(projectConfigFlags[flagSettings.key])) {
        flagConfig[flagSettings.key] = projectConfigFlags[
          flagSettings.key
        ] as Record<string, boolean>
      }
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

  for (const flag of Object.keys(flagConfig)) {
    featureFlagRouter.setFlag(flag, flagConfig[flag])
  }

  return featureFlagRouter
}
