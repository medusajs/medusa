import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  deleteApiKeysWorkflow,
  updateApiKeysWorkflow,
} from "@medusajs/core-flows"

import { UpdateApiKeyDTO } from "@medusajs/types"
import { defaultAdminApiKeyFields } from "../query-config"
import { remoteQueryObjectFromString } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "api-key",
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
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ apiKey: result[0] })
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
    object: "api-key",
    deleted: true,
  })
}
