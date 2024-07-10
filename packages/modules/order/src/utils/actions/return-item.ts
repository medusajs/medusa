import {
  ChangeActionType,
  MathBN,
  MedusaError,
  isDefined,
} from "@medusajs/utils"
import { OrderChangeProcessing } from "../calculate-order-change"
import {
  setActionReference,
  unsetActionReference,
} from "../set-action-reference"

OrderChangeProcessing.registerActionType(ChangeActionType.RETURN_ITEM, {
  isDeduction: true,
  awaitRequired: true,
  operation({ action, currentOrder, options }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )!

    existing.detail.return_requested_quantity ??= 0
    existing.detail.return_requested_quantity = MathBN.add(
      existing.detail.return_requested_quantity,
      action.details.quantity
    )

    setActionReference(existing, action, options)

    return MathBN.mult(existing.unit_price, action.details.quantity)
  },
  revert({ action, currentOrder }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )!

    existing.detail.return_requested_quantity = MathBN.sub(
      existing.detail.return_requested_quantity,
      action.details.quantity
    )

    unsetActionReference(existing, action)
  },
  validate({ action, currentOrder }) {
    const refId = action.details?.reference_id
    if (!isDefined(refId)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Details reference ID is required."
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
        `Quantity to return of item ${refId} is required.`
      )
    }

    const quantityAvailable = MathBN.sub(
      existing!.detail?.fulfilled_quantity ?? 0,
      existing!.detail?.return_requested_quantity ?? 0
    )

    const greater = MathBN.gt(action.details?.quantity, quantityAvailable)
    if (greater) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot request to return more items than what was fulfilled for item ${refId}.`
      )
    }
  },
})
