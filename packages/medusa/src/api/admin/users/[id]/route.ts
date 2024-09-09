import { deleteUsersWorkflow, updateUsersWorkflow } from "@medusajs/core-flows"
import { HttpTypes, UpdateUserDTO } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils"
import { AdminUpdateUserType } from "../validators"
import { refetchUser } from "../helpers"

// Get user
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminUserResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params

  const {
    data: [user],
  } = await query.graph({
    entryPoint: "user",
    variables: { id },
    fields: req.remoteQueryConfig.fields,
  })

  if (!user) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `User with id: ${id} was not found`
    )
  }

  res.status(200).json({ user })
}

// update user
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateUserType>,
  res: MedusaResponse<HttpTypes.AdminUserResponse>
) => {
  const workflow = updateUsersWorkflow(req.scope)

  const input = {
    updates: [
      {
        id: req.params.id,
        ...req.validatedBody,
      } as UpdateUserDTO,
    ],
  }

  await workflow.run({ input })

  const user = await refetchUser(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ user })
}

// delete user
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminUserDeleteResponse>
) => {
  const { id } = req.params
  const workflow = deleteUsersWorkflow(req.scope)

  await workflow.run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "user",
    deleted: true,
  })
}

export const AUTHENTICATE = false
