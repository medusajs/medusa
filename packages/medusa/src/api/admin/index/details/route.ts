import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  INDEX_MODULE_DEPRECATION_MESSAGE,
  Modules,
} from "@medusajs/framework/utils"

/**
 * Get the index information for all entities that are indexed and their sync state
 *
 * @since 2.11.2
 * @featureFlag index
 * @deprecated The Index Module is deprecated and will be removed in a future release. Use `query.graph()` instead, which filters across linked modules: https://docs.medusajs.com/learn/fundamentals/query#filter-by-linked-data-models-property
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<void>,
  res: MedusaResponse<HttpTypes.AdminIndexDetailsResponse>
) => {
  req.scope
    .resolve(ContainerRegistrationKeys.LOGGER)
    .warn(INDEX_MODULE_DEPRECATION_MESSAGE)

  const indexModuleService = req.scope.resolve(Modules.INDEX)
  const indexInfo = await indexModuleService.getInfo()
  res.json({
    metadata: indexInfo,
  })
}
