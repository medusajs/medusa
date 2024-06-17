import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

import { createCollectionsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { AdminCreateCollectionType } from "./validators"
import { refetchCollection } from "./helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "product_collection",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: collections, metadata } = await remoteQuery(query)

  res.json({
    collections,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateCollectionType>,
  res: MedusaResponse
) => {
  const input = [
    {
      ...req.validatedBody,
    },
  ]

  const { result } = await createCollectionsWorkflow(req.scope).run({
    input: { collections: input },
  })

  const collection = await refetchCollection(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ collection })
}
