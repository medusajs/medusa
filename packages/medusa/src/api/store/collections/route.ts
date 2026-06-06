import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"

import { ContainerRegistrationKeys } from "@zjedene-medusa/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.StoreCollectionListParams>,
  res: MedusaResponse<HttpTypes.StoreCollectionListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: collections, metadata } = await query.graph(
    {
      entity: "product_collection",
      filters: req.filterableFields,
      pagination: req.queryConfig.pagination,
      fields: req.queryConfig.fields,
    },
    {
      locale: req.locale,
    }
  )

  res.json({
    collections,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  })
}
