import { MedusaError, isDefined } from "@medusajs/utils"
import { ChangeActionType } from "../action-key"
import { OrderChangeProcessing } from "../calculate-order-change"

OrderChangeProcessing.registerActionType(ChangeActionType.FULFILL_ITEM, {
  operation({ action, currentOrder }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )!

    existing.detail.fulfilled_quantity ??= 0

    existing.detail.fulfilled_quantity += action.details.quantity
  },
  revert({ action, currentOrder }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.reference_id
    )!

    existing.detail.fulfilled_quantity -= action.details.quantity
  },
  validate({ action, currentOrder }) {
    const refId = action.details.reference_id
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

    if (!action.details.quantity) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Quantity to fulfill of item ${refId} is required.`
      )
    }

    if (action.details.quantity < 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Quantity of item ${refId} must be greater than 0.`
      )
    }

    const notFulfilled =
      (existing.quantity as number) -
      (existing.detail.fulfilled_quantity as number)

    if (action.details.quantity > notFulfilled) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot fulfill more items than what was ordered for item ${refId}.`
      )
    }
  },
})
