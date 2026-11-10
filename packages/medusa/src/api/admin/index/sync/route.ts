import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  INDEX_MODULE_DEPRECATION_MESSAGE,
  Modules,
} from "@medusajs/framework/utils"

/**
 * @since 2.11.2
 * @featureFlag index
 * @deprecated The Index Module is deprecated and will be removed in a future release. Use `query.graph()` instead, which filters across linked modules: https://docs.medusajs.com/learn/fundamentals/query#filter-by-linked-data-models-property
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminIndexSyncPayload>,
  res: MedusaResponse
) => {
  req.scope
    .resolve(ContainerRegistrationKeys.LOGGER)
    .warn(INDEX_MODULE_DEPRECATION_MESSAGE)

  const indexService = req.scope.resolve(Modules.INDEX)
  const strategy = req.validatedBody.strategy

  await indexService.sync({ strategy })

  res.send(200)
}
