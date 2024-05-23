import { createUserAccountWorkflow } from "@medusajs/core-flows"
import { CreateUserDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchUser } from "./helpers"
import { generateJwtToken } from "../../utils/auth/token"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "user",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: users, metadata } = await remoteQuery(query)
  res.status(200).json({
    users,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateUserDTO>,
  res: MedusaResponse
) => {
  // If `actor_id` is present, the request carries authentication for an existing user
  if (req.auth_context.actor_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Request carries authentication for an existing user"
    )
  }

  const input = {
    input: {
      userData: req.validatedBody,
      authIdentityId: req.auth_context.auth_identity_id,
    },
    throwOnError: false,
  }

  const { result, errors } = await createUserAccountWorkflow(req.scope).run(
    input
  )

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const { http } = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  ).projectConfig
  const { jwtSecret, jwtExpiresIn } = http
  const token = generateJwtToken(
    {
      actor_id: result.id,
      actor_type: "user",
      auth_identity_id: req.auth_context.auth_identity_id,
      app_metadata: {
        user_id: result.id,
      },
    },
    {
      secret: jwtSecret,
      expiresIn: jwtExpiresIn,
    }
  )

  const user = await refetchUser(
    result.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ user, token })
}
