import { createApiKeysWorkflow } from "@medusajs/core-flows"
import { CreateApiKeyDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { defaultAdminApiKeyFields } from "./query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
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

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const input = [
    {
      ...(req.validatedBody as Omit<CreateApiKeyDTO, "created_by">),
      created_by: req.auth_user?.id,
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
