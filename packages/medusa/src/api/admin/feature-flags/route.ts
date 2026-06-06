import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework/http"
import { ContainerRegistrationKeys } from "@zjedene-medusa/framework/utils"

export const AUTHENTICATE = false

/**
 * @since 2.10.0
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<{ feature_flags: Record<string, boolean> }>
) => {
  const featureFlagRouter = req.scope.resolve(
    ContainerRegistrationKeys.FEATURE_FLAG_ROUTER
  ) as any

  const flags = featureFlagRouter.listFlags()

  // Convert array of flags to a simple key-value object
  const featureFlags: Record<string, boolean> = {}
  flags.forEach((flag) => {
    featureFlags[flag.key] = flag.value
  })

  res.json({ feature_flags: featureFlags })
}
