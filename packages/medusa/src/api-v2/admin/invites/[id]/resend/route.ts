import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

import { refreshInviteTokensWorkflow } from "@medusajs/core-flows"
import { refetchInvite } from "../../helpers"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const workflow = refreshInviteTokensWorkflow(req.scope)

  const input = {
    invite_ids: [req.params.id],
  }

  const { result } = await workflow.run({ input })
  const invite = await refetchInvite(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ invite })
}
