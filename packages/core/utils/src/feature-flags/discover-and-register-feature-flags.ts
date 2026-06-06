import { FlagSettings, Logger } from "@zjedene-medusa/types"
import { discoverFeatureFlagsFromDir } from "./discover-feature-flags"
import { FlagRouter } from "./flag-router"
import { registerFeatureFlag } from "./register-flag"

export interface DiscoverAndRegisterOptions {
  flagDir: string
  projectConfigFlags?: Record<string, any>
  router: FlagRouter
  logger?: Logger
  track?: (key: string) => void
  maxDepth?: number
}

/**
 * Utility function to discover and register feature flags from a directory
 */
export async function discoverAndRegisterFeatureFlags(
  options: DiscoverAndRegisterOptions
): Promise<void> {
  const {
    flagDir,
    projectConfigFlags = {},
    router,
    logger,
    track,
    maxDepth,
  } = options

  const discovered = await discoverFeatureFlagsFromDir(flagDir, maxDepth)

  for (const def of discovered) {
    const registerOptions: Parameters<typeof registerFeatureFlag>[0] = {
      flag: def as FlagSettings,
      projectConfigFlags,
      router,
      logger,
      track,
    }

    registerFeatureFlag(registerOptions)
  }
}
