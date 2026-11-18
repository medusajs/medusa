import { updateUsersWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes, UpdateUserDTO } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { refetchUser } from "../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminUserParams>,
  res: MedusaResponse<HttpTypes.AdminUserResponse>
) => {
  const id = req.auth_context.actor_id
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  if (!id) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, `User ID not found`)
  }

  const query = remoteQueryObjectFromString({
    entryPoint: "user",
    variables: { id },
    fields: req.queryConfig.fields,
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

/**
 * Updates the authenticated user's own profile. Unlike `POST /admin/users/:id`,
 * this route is not guarded by `user:update`: every user may edit itself.
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminUpdateUser>,
  res: MedusaResponse<HttpTypes.AdminUserResponse>
) => {
  const id = req.auth_context.actor_id

  if (!id) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, `User ID not found`)
  }

  await updateUsersWorkflow(req.scope).run({
    input: { updates: [{ id, ...req.validatedBody } as UpdateUserDTO] },
  })

  const user = await refetchUser(id, req.scope, req.queryConfig.fields)

  res.status(200).json({ user })
}
