import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminOrderLineItemsListResponse>
) => {
  const { id } = req.params

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: line_items } = await query.graph({
    entity: "order_line_items",
    filters: {
      ...req.filterableFields,
      order_id: id,
    },
    fields: req.remoteQueryConfig.fields,
  })

  res.status(200).json({ line_items })
}
