import { FlagSettings, Logger } from "@zjedene-medusa/types"
import {
  isDefined,
  isObject,
  isString,
  isTruthy,
  objectFromStringPath,
} from "../common"
import { FlagRouter } from "./flag-router"

export type RegisterFeatureFlagOptions = {
  flag: FlagSettings
  projectConfigFlags: Record<string, string | boolean | Record<string, boolean>>
  router: FlagRouter
  logger?: Logger
  track?: (key: string) => void
}

/**
 * Registers a feature flag on the provided router.
 * Resolving precedence:
 * - env overrides
 * - project config overrides
 * - default value
 */
export function registerFeatureFlag(options: RegisterFeatureFlagOptions) {
  const { flag, projectConfigFlags, router, logger, track } = options

  let value: boolean | Record<string, boolean> = isTruthy(flag.default_val)
  let from: string | undefined

  if (isDefined(process.env[flag.env_key])) {
    from = "environment"
    const envVal = process.env[flag.env_key]

    value = isTruthy(envVal)

    const parsedFromEnv = isString(envVal) ? envVal.split(",") : []
    if (parsedFromEnv.length > 1) {
      value = objectFromStringPath(parsedFromEnv)
    }
  } else if (isDefined(projectConfigFlags[flag.key])) {
    from = "project config"

    const pc = projectConfigFlags[flag.key] as string | boolean
    value = isTruthy(pc)

    if (isObject(projectConfigFlags[flag.key])) {
      value = projectConfigFlags[flag.key] as Record<string, boolean>
    }
  }

  if (logger && from) {
    logger.info(
      `Using flag ${flag.env_key} from ${from} with value ${JSON.stringify(
        value
      )}`
    )
  }

  if (track && value === true) {
    track(flag.key)
  }

  router.setFlag(flag.key, value)
}
