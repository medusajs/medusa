import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminOrderItemsFilters>,
  res: MedusaResponse<HttpTypes.AdminOrderLineItemsListResponse>
) => {
  const { id } = req.params

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const result = await query.graph({
    entity: "order_items",
    filters: {
      ...req.filterableFields,
      order_id: id,
    },
    fields: req.remoteQueryConfig.fields,
    pagination: req.remoteQueryConfig.pagination,
  })

  const { data, metadata } = result
  res.json({
    order_items: data,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  })
}
