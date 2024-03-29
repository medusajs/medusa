import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

import { CreateRegionDTO } from "@medusajs/types"
import { createRegionsWorkflow } from "@medusajs/core-flows"
import { remoteQueryObjectFromString } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "region",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: regions, metadata } = await remoteQuery(queryObject)

  res.json({
    regions,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateRegionDTO>,
  res: MedusaResponse
) => {
  const input = [
    {
      ...req.validatedBody,
    },
  ]

  const { result, errors } = await createRegionsWorkflow(req.scope).run({
    input: { regions: input },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ region: result[0] })
}
