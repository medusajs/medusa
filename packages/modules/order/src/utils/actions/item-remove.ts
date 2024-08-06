import { ChangeActionType, MathBN, MedusaError } from "@medusajs/utils"
import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(ChangeActionType.ITEM_REMOVE, {
  isDeduction: true,
  operation({ action, currentOrder, options }) {
    const existingIndex = currentOrder.items.findIndex(
      (item) => item.id === action.details.reference_id
    )

    const existing = currentOrder.items[existingIndex]

    existing.detail.quantity ??= 0

    existing.quantity = MathBN.sub(existing.quantity, action.details.quantity)
    existing.detail.quantity = MathBN.sub(
      existing.detail.quantity,
      action.details.quantity
    )

    setActionReference(existing, action, options)

    if (MathBN.lte(existing.quantity, 0)) {
      currentOrder.items.splice(existingIndex, 1)
    }

    return MathBN.mult(existing.unit_price, action.details.quantity)
  },
  validate({ action, currentOrder }) {
    const refId = action.details?.reference_id
    if (refId == null) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Reference ID is required."
      )
    }

    const existing = currentOrder.items.find((item) => item.id === refId)
    if (!existing) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Item ID "${refId}" not found.`
      )
    }

    if (!action.details?.quantity) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Quantity of item ${refId} is required.`
      )
    }

    if (MathBN.lt(action.details?.quantity, 1)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Quantity of item ${refId} must be greater than 0.`
      )
    }

    const notFulfilled = MathBN.sub(
      existing.quantity,
      existing.detail?.fulfilled_quantity
    )

    const greater = MathBN.gt(action.details?.quantity, notFulfilled)
    if (greater) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot remove fulfilled item: Item ${refId}.`
      )
    }
  },
})
