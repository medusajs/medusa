import { createApiKeysWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminCreateApiKeyType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "api_key",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: apiKeys, metadata } = await remoteQuery(queryObject)

  res.json({
    api_keys: apiKeys,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateApiKeyType>,
  res: MedusaResponse
) => {
  const input = [
    {
      ...req.validatedBody,
      created_by: req.auth_context.actor_id,
    },
  ]

  const { result, errors } = await createApiKeysWorkflow(req.scope).run({
    input: { api_keys: input },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  // We should not refetch the api key here, as we need to show the secret key in the response (and never again)
  // And the only time we get to see the secret, is when we create it
  res.status(200).json({ api_key: result[0] })
}
