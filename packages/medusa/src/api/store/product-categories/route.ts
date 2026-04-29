import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  StoreProductCategoryListParams,
  StoreProductCategoryListResponse,
} from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreProductCategoryListParams>,
  res: MedusaResponse<StoreProductCategoryListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: product_categories, metadata } = await query.graph(
    {
      entity: "product_category",
      fields: req.queryConfig.fields,
      filters: req.filterableFields,
      pagination: req.queryConfig.pagination,
    },
    {
      locale: req.locale,
    }
  )

  res.json({
    product_categories,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  })
}
