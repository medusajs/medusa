import {
  deleteApiKeysWorkflow,
  updateApiKeysWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

import { UpdateApiKeyDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { defaultAdminApiKeyFields } from "../query-config"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "api_key",
    variables,
    fields: defaultAdminApiKeyFields,
  })

  const [apiKey] = await remoteQuery(queryObject)

  res.status(200).json({ apiKey })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<Omit<UpdateApiKeyDTO, "id">>,
  res: MedusaResponse
) => {
  const { result, errors } = await updateApiKeysWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody as UpdateApiKeyDTO,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "api_key",
    variables: {
      id: req.params.id,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [apiKey] = await remoteQuery(queryObject)

  res.status(200).json({ api_key: apiKey })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  const { errors } = await deleteApiKeysWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "api_key",
    deleted: true,
  })
}
