import { IInventoryService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { LineItemService } from "../../../../../services"
import { EntityManager } from "typeorm"

export const validateUpdateReservationQuantity = async (
  lineItemId: string,
  quantityUpdate: number,
  context: {
    lineItemService: LineItemService
    inventoryService: IInventoryService
    manager: EntityManager
  }
) => {
  const { lineItemService, inventoryService } = context
  const [reservationItems] = await inventoryService.listReservationItems(
    {
      line_item_id: lineItemId,
    },
    {},
    {
      transactionManager: context.manager,
    }
  )

  const totalQuantity = reservationItems.reduce(
    (acc, cur) => acc + cur.quantity,
    quantityUpdate
  )

  const lineItem = await lineItemService.retrieve(lineItemId)

  if (totalQuantity > lineItem.quantity - (lineItem.fulfilled_quantity || 0)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "The reservation quantity cannot be greater than the unfulfilled line item quantity"
    )
  }
}
