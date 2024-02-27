import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

import { CreateApiKeyDTO } from "@medusajs/types"
import { createApiKeysWorkflow } from "@medusajs/core-flows"
import { defaultAdminApiKeyFields } from "./query-config"
import { remoteQueryObjectFromString } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "api-key",
    variables: {
      filters: req.filterableFields,
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    },
    fields: defaultAdminApiKeyFields,
  })

  const { rows: apiKeys, metadata } = await remoteQuery(queryObject)

  res.json({
    apiKeys,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<Omit<CreateApiKeyDTO, "created_by">>,
  res: MedusaResponse
) => {
  const input = [
    {
      ...req.validatedBody,
      created_by: req.auth.actor_id,
    } as CreateApiKeyDTO,
  ]

  const { result, errors } = await createApiKeysWorkflow(req.scope).run({
    input: { apiKeysData: input },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ apiKey: result[0] })
}
