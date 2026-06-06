import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { ContainerRegistrationKeys } from "@zjedene-medusa/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.StoreProductTagListParams>,
  res: MedusaResponse<HttpTypes.StoreProductTagListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: product_tags, metadata } = await query.graph(
    {
      entity: "product_tag",
      filters: req.filterableFields,
      pagination: req.queryConfig.pagination,
      fields: req.queryConfig.fields,
    },
    {
      locale: req.locale,
    }
  )

  res.json({
    product_tags,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}
