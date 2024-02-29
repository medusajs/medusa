import { MedusaError, isDefined } from "@medusajs/utils"
import { VirtualOrder } from "@types"
import { ChangeActionType } from "../action-key"
import { OrderChangeProcessing } from "../calculate-order-change"

OrderChangeProcessing.registerActionType(ChangeActionType.ITEM_ADD, {
  operation({ action, currentOrder }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.reference_id
    )

    if (existing) {
      existing.quantity += action.details.quantity
    } else {
      currentOrder.items.push({
        id: action.reference_id!,
        unit_price: action.details.unit_price,
        quantity: action.details.quantity,
      } as VirtualOrder["items"][0])
    }

    return action.details.unit_price * action.details.quantity
  },
  revert({ action, currentOrder }) {
    const existingIndex = currentOrder.items.findIndex(
      (item) => item.id === action.reference_id
    )

    if (existingIndex > -1) {
      const existing = currentOrder.items[existingIndex]
      existing.quantity -= action.details.quantity

      if (existing.quantity <= 0) {
        currentOrder.items.splice(existingIndex, 1)
      }
    }
  },
  validate({ action }) {
    if (!isDefined(action.reference_id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Reference ID is required."
      )
    }

    if (!isDefined(action.details.unit_price)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Unit price is required."
      )
    }

    if (action.details.quantity < 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Quantity must be greater than 0."
      )
    }
  },
})
