import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { HttpTypes } from "@medusajs/types"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminUserResponse>
) => {
  const id = req.auth_context.actor_id
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  if (!id) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, `User ID not found`)
  }

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

export const AUTHENTICATE = false
