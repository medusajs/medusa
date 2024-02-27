import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

import { AdminPostInvitesInviteAcceptReq } from "../validators"
import { IUserModuleService } from "@medusajs/types"
import { InviteWorkflow } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { acceptInviteWorkflow } from "@medusajs/core-flows"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostInvitesInviteAcceptReq>,
  res: MedusaResponse
) => {
  if (req.auth.actor_id) {
    const moduleService: IUserModuleService = req.scope.resolve(
      ModuleRegistrationName.USER
    )
    const user = moduleService.retrieve(req.auth.actor_id)
    res.status(200).json({ user })
    return
  }

  const workflow = acceptInviteWorkflow(req.scope)

  const input = {
    invite_token: req.filterableFields.token as string,
    auth_user_id: req.auth?.auth_user_id,
    user: req.validatedBody,
  } as InviteWorkflow.AcceptInviteWorkflowInputDTO

  let users
  try {
    const { result } = await workflow.run({ input })
    users = result
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  // Set customer_id on session user if we are in session
  if (req.session.auth_user) {
    req.session.auth_user.app_metadata.user_id = users[0].id
  }

  res.status(200).json({ user: users[0] })
}
