import { acceptInviteWorkflow } from "@medusajs/core-flows"
import { InviteWorkflow } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { AdminInviteAcceptType } from "../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminInviteAcceptType>,
  res: MedusaResponse
) => {
  if (req.auth_context.actor_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "The user is already authenticated and cannot accept an invite."
    )
  }

  const input = {
    invite_token: req.filterableFields.token as string,
    auth_identity_id: req.auth_context.auth_identity_id,
    user: req.validatedBody,
  } as InviteWorkflow.AcceptInviteWorkflowInputDTO

  let users

  try {
    const { result } = await acceptInviteWorkflow(req.scope).run({ input })
    users = result
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  res.status(200).json({ user: users[0] })
}

export const AUTHENTICATE = false
