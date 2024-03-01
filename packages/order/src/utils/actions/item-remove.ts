import { MedusaError, isDefined } from "@medusajs/utils"
import { VirtualOrder } from "@types"
import { ChangeActionType } from "../action-key"
import { OrderChangeProcessing } from "../calculate-order-change"

OrderChangeProcessing.registerActionType(ChangeActionType.ITEM_REMOVE, {
  isDeduction: true,
  operation({ action, currentOrder }) {
    const existingIndex = currentOrder.items.findIndex(
      (item) => item.id === action.reference_id
    )

    const existing = currentOrder.items[existingIndex]
    existing.quantity -= action.details.quantity

    if (existing.quantity <= 0) {
      currentOrder.items.splice(existingIndex, 1)
    }

    return existing.unit_price * action.details.quantity
  },
  revert({ action, currentOrder }) {
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
  },
  validate({ action, currentOrder }) {
    const refId = action.reference_id
    if (!isDefined(refId)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Reference ID is required."
      )
    }

    const existing = currentOrder.items.find((item) => item.id === refId)
    if (!existing) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Reference ID "${refId}" not found.`
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

    const notFulfilled =
      (existing.quantity as number) - (existing.fulfilled_quantity as number)

    if (action.details.quantity > notFulfilled) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cannot remove fulfilled items."
      )
    }
  },
})
