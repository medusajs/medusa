import { acceptInviteWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { InviteWorkflow } from "@medusajs/types"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  if (req.auth_user?.app_metadata?.user_id) {
    res.status(200).json({ user: req.auth_user })
    return
  }

  const workflow = acceptInviteWorkflow(req.scope)

  const input = {
    invite_token: req.query.invite_token,
    auth_user_id: req.auth_user!.id,
    user: req.validatedBody,
  }

  const users = await workflow.run({ input })

  console.warn("users", users)

  res.status(200).json({ user: users[0] })
}
