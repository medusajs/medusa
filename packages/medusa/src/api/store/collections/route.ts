import { HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.StoreCollectionFilters>,
  res: MedusaResponse<HttpTypes.StoreCollectionListResponse>
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
