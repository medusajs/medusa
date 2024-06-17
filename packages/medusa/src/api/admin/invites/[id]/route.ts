import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { MedusaError } from "@medusajs/utils"

import { deleteInvitesWorkflow } from "@medusajs/core-flows"
import { refetchInvite } from "../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const invite = await refetchInvite(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!invite) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Invite with id: ${id} was not found`
    )
  }

  res.status(200).json({ invite })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const workflow = deleteInvitesWorkflow(req.scope)

  await workflow.run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "invite",
    deleted: true,
  })
}

export const AUTHENTICATE = false
