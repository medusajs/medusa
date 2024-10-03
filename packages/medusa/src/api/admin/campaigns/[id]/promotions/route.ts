import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { addOrRemoveCampaignPromotionsWorkflow } from "@medusajs/core-flows"
import { HttpTypes, LinkMethodRequest } from "@medusajs/framework/types"
import { refetchCampaign } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<LinkMethodRequest>,
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
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ campaign })
}
