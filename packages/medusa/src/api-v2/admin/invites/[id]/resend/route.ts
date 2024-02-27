import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

import { refreshInviteTokensWorkflow } from "@medusajs/core-flows"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const workflow = refreshInviteTokensWorkflow(req.scope)

  const input = {
    invite_ids: [req.params.id],
  }

  const { result: invites } = await workflow.run({ input })

  res.status(200).json({ invite: invites[0] })
}
