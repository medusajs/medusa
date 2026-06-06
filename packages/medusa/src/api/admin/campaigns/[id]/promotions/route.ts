import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

import { addOrRemoveCampaignPromotionsWorkflow } from "@zjedene-medusa/core-flows"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { refetchCampaign } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminBatchLink,
    HttpTypes.AdminGetCampaignParams
  >,
  res: MedusaResponse<HttpTypes.AdminCampaignResponse>
) => {
  const { id } = req.params
  const { add, remove } = req.validatedBody
  await addOrRemoveCampaignPromotionsWorkflow(req.scope).run({
    input: { id, add, remove },
  })

  const campaign = await refetchCampaign(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ campaign })
}
