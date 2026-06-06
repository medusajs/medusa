import { trackFeatureFlag } from "@zjedene-medusa/telemetry"
import {
  ContainerRegistrationKeys,
  discoverAndRegisterFeatureFlags,
  FeatureFlag,
  FlagRouter,
} from "@zjedene-medusa/utils"
import { asFunction } from "../deps/awilix"
import { normalize } from "path"
import { configManager } from "../config"
import { container } from "../container"
import { logger as defaultLogger } from "../logger"

container.register(
  ContainerRegistrationKeys.FEATURE_FLAG_ROUTER,
  asFunction(() => FeatureFlag)
)

/**
 * Load feature flags from a directory and from the already loaded config under the hood
 * @param sourcePath
 */
export async function featureFlagsLoader(
  sourcePath?: string
): Promise<FlagRouter> {
  const confManager = !!configManager.baseDir
    ? configManager.config
    : { featureFlags: {}, logger: defaultLogger }

  const { featureFlags: projectConfigFlags = {}, logger } = confManager

  if (!sourcePath) {
    return FeatureFlag
  }

  const flagDir = normalize(sourcePath)

  await discoverAndRegisterFeatureFlags({
    flagDir,
    projectConfigFlags,
    router: FeatureFlag,
    logger,
    track: (key) => trackFeatureFlag(key),
  })

  return FeatureFlag
}
