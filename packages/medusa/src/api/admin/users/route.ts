import { createUserAccountWorkflow } from "@medusajs/core-flows"
import { CreateUserDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import jwt from "jsonwebtoken"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchUser } from "./helpers"

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
  if (req.auth.actor_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Request carries authentication for an existing user"
    )
  }

  const input = {
    input: {
      userData: req.validatedBody,
      authUserId: req.auth.auth_user_id,
    },
    throwOnError: false,
  }

  const { errors } = await createUserAccountWorkflow(req.scope).run(input)

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const user = await refetchUser(
    req.auth.auth_user_id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  const { http } = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  ).projectConfig

  const token = jwt.sign(user, http.jwtSecret, {
    expiresIn: http.jwtExpiresIn,
  })

  res.status(200).json({ user, token })
}
