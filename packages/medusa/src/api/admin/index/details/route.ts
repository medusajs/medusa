import { AuthenticatedMedusaRequest, MedusaResponse } from "@zjedene-medusa/framework"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"

/**
 * Get the index information for all entities that are indexed and their sync state
 * 
 * @since 2.11.2
 * @featureFlag index
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<void>,
  res: MedusaResponse<HttpTypes.AdminIndexDetailsResponse>
) => {
  const indexModuleService = req.scope.resolve(Modules.INDEX)
  const indexInfo = await indexModuleService.getInfo()
  res.json({
    metadata: indexInfo,
  })
}
