import { AuthenticatedMedusaRequest, MedusaResponse } from "@zjedene-medusa/framework"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"

/**
 * @since 2.11.2
 * @featureFlag index
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminIndexSyncPayload>,
  res: MedusaResponse
) => {
  const indexService = req.scope.resolve(Modules.INDEX)
  const strategy = req.validatedBody.strategy

  await indexService.sync({ strategy })

  res.send(200)
}
