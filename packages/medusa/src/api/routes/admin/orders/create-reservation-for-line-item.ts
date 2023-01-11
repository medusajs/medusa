import { MedusaError } from "medusa-core-utils"
import {
  LineItemService,
  ProductVariantInventoryService,
} from "../../../../services"

export default async (req, res) => {
  const { id, line_item_id } = req.params

  const { validatedBody } = req as {
    validatedBody: AdminOrdersOrderLineItemReservationReq
  }
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  const lineItemService: LineItemService = req.scope.resolve("lineItemService")

  const lineItem = await lineItemService.retrieve(line_item_id)

  if (!lineItem.variant_id) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Can't create a reservation for a line-item wihtout a variant`
    )
  }

  const quantity = validatedBody.quantity || lineItem.quantity

  await productVariantInventoryService.validateInventoryAtLocation(
    [{ ...lineItem, quantity }],
    validatedBody.location_id
  )

  const reservations = await productVariantInventoryService.reserveQuantity(
    lineItem.variant_id,
    quantity,
    {
      locationId: validatedBody.location_id,
    }
  )

  res.json({ reservation: reservations[0] })
}

export class AdminOrdersOrderLineItemReservationReq {
  location_id: string

  quantity?: number
}
