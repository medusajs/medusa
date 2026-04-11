import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { refreshInviteTokensWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import { refetchInvite } from "../../helpers"

export const POST = async (
  req: MedusaRequest<{}, HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.AdminInviteResponse>
) => {
  const workflow = refreshInviteTokensWorkflow(req.scope)

  const input = {
    invite_ids: [req.params.id],
  }

  const { result } = await workflow.run({ input })
  const invite = await refetchInvite(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ invite })
}
