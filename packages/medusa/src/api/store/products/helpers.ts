import { MedusaContainer } from "@medusajs/types"
import { MedusaRequest } from "../../../types/routing"
import { refetchEntities, refetchEntity } from "../../utils/refetch-entity"

export const refetchProduct = async (
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[]
) => {
  return await refetchEntity("product", idOrFilter, scope, fields)
}

export const maybeApplyStockLocationId = async (req: MedusaRequest, ctx) => {
  const withInventoryQuantity = req.remoteQueryConfig.fields.some((field) =>
    field.includes("variants.inventory_quantity")
  )

  if (!withInventoryQuantity) {
    return
  }

  const salesChannelId = req.filterableFields.sales_channel_id || []

  const entities = await refetchEntities(
    "sales_channel_location",
    { sales_channel_id: salesChannelId },
    req.scope,
    ["stock_location_id"]
  )

  return entities.map((entity) => entity.stock_location_id)
}
