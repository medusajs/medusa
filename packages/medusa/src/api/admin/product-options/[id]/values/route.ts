import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductOptionValueListParams>,
  res: MedusaResponse<HttpTypes.AdminProductOptionValueListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: product_option_values, metadata } = await query.graph({
    entity: "product_option_value",
    filters: {
      ...req.filterableFields,
      option_id: req.params.id,
    },
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  res.json({
    product_option_values,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  })
}
