import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { HttpTypes } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * @since 2.12.3
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminPriceListParams>,
  res: MedusaResponse<HttpTypes.AdminPriceListPriceListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const result = await query.graph({
    entity: "price",
    fields: req.queryConfig.fields,
    filters: {
      ...req.filterableFields,
      price_list_id: req.params.id,
    },
    pagination: req.queryConfig.pagination,
  })

  res.status(200).json({
    prices: result.data,
    count: result.metadata?.count ?? 0,
    offset: result.metadata?.skip ?? 0,
    limit: result.metadata?.take ?? 0,
  })
}
