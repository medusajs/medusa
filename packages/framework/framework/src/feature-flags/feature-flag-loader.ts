import {
  ContainerRegistrationKeys,
  FlagRouter,
  isDefined,
  isObject,
  isString,
  objectFromStringPath,
} from "@medusajs/utils"
import { trackFeatureFlag } from "medusa-telemetry"
import { join, normalize } from "path"
import { logger } from "../logger"
import { FlagSettings } from "./types"
import { container } from "../container"
import { asFunction } from "awilix"
import { configManager } from "../config"
import { readdir } from "fs/promises"

const isTruthy = (val: string | boolean | undefined): boolean => {
  if (typeof val === "string") {
    return val.toLowerCase() === "true"
  }
  return !!val
}

export const featureFlagRouter = new FlagRouter({})

container.register(
  ContainerRegistrationKeys.FEATURE_FLAG_ROUTER,
  asFunction(() => featureFlagLoader)
)

const excludedFiles = ["index.js", "index.ts"]
const flagConfig: Record<string, boolean | Record<string, boolean>> = {}

function registerFlag(
  flag: FlagSettings,
  projectConfigFlags: Record<string, string | boolean | Record<string, boolean>>
) {
  flagConfig[flag.key] = isTruthy(flag.default_val)

  let from
  if (isDefined(process.env[flag.env_key])) {
    from = "environment"
    const envVal = process.env[flag.env_key]

    // MEDUSA_FF_ANALYTICS="true"
    flagConfig[flag.key] = isTruthy(process.env[flag.env_key])

    const parsedFromEnv = isString(envVal) ? envVal.split(",") : []

    // MEDUSA_FF_WORKFLOWS=createProducts,deleteProducts
    if (parsedFromEnv.length > 1) {
      flagConfig[flag.key] = objectFromStringPath(parsedFromEnv)
    }
  } else if (isDefined(projectConfigFlags[flag.key])) {
    from = "project config"

    // featureFlags: { analytics: "true" | true }
    flagConfig[flag.key] = isTruthy(
      projectConfigFlags[flag.key] as string | boolean
    )

    // featureFlags: { workflows: { createProducts: true } }
    if (isObject(projectConfigFlags[flag.key])) {
      flagConfig[flag.key] = projectConfigFlags[flag.key] as Record<
        string,
        boolean
      >
    }
  }

  if (logger && from) {
    logger.info(
      `Using flag ${flag.env_key} from ${from} with value ${
        flagConfig[flag.key]
      }`
    )
  }

  if (flagConfig[flag.key]) {
    trackFeatureFlag(flag.key)
  }
}

/**
 * Load feature flags from a directory
 * @param sourcePath
 */
export async function featureFlagLoader(
  sourcePath: string
): Promise<FlagRouter> {
  const { featureFlags: projectConfigFlags = {} } = configManager.config

  const flagDir = normalize(sourcePath)

  await readdir(flagDir, { recursive: true, withFileTypes: true }).then(
    async (files) => {
      if (!files?.length) {
        return
      }

      files.map(async (file) => {
        if (file.isDirectory()) {
          return await featureFlagLoader(join(flagDir, file.name))
        }

        if (file.name.endsWith(".d.ts") || excludedFiles.includes(file.name)) {
          return
        }

        const fileExports = await import(join(flagDir, file.name))
        const featureFlag = fileExports.default

        if (!featureFlag) {
          return
        }

        registerFlag(featureFlag, projectConfigFlags)
        return
      })
    }
  )

  return featureFlagRouter
}
