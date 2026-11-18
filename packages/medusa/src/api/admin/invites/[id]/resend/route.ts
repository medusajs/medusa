import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { refreshInviteTokensWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import { refetchInvite } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<{}, HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.AdminInviteResponse>
) => {
  const workflow = refreshInviteTokensWorkflow(req.scope)

  const input = {
    invite_ids: [req.params.id],
  }

  const { result } = await workflow.run({ input })
  const invite = await refetchInvite(req, result[0].id)

  res.status(200).json({ invite })
}
