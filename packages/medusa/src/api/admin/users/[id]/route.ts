import {
  removeUserAccountWorkflow,
  updateUsersWorkflow,
} from "@medusajs/core-flows"
import { HttpTypes, UpdateUserDTO } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { refetchUser } from "../helpers"
import { AdminUpdateUserType } from "../validators"

// Get user
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminUserResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const { id } = req.params

  const query = remoteQueryObjectFromString({
    entryPoint: "user",
    variables: { id },
    fields: req.remoteQueryConfig.fields,
  })

  const [user] = await remoteQuery(query)
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
  const { actor_id } = req.auth_context

  if (actor_id !== id) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You are not allowed to delete other users"
    )
  }

  const workflow = removeUserAccountWorkflow(req.scope)

  await workflow.run({
    input: { userId: id },
  })

  res.status(200).json({
    id,
    object: "user",
    deleted: true,
  })
}

export const AUTHENTICATE = false
