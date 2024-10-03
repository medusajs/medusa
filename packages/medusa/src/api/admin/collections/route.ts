import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { createCollectionsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { AdminCreateCollectionType } from "./validators"
import { refetchCollection } from "./helpers"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCollectionListParams>,
  res: MedusaResponse<HttpTypes.AdminCollectionListResponse>
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
  res: MedusaResponse<HttpTypes.AdminCollectionResponse>
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
