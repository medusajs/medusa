import { MedusaError, isDefined } from "@medusajs/utils"
import { ChangeActionType } from "../action-key"
import { OrderChangeProcessing } from "../calculate-order-change"

OrderChangeProcessing.registerActionType(ChangeActionType.RETURN_ITEM, {
  isDeduction: true,
  awaitRequired: true,
  operation({ action, currentOrder }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )!

    existing.detail.return_requested_quantity ??= 0
    existing.detail.return_requested_quantity += action.details.quantity

    return existing.unit_price * action.details.quantity
  },
  revert({ action, currentOrder }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )!

    existing.detail.return_requested_quantity -= action.details.quantity
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
        `Reference ID "${refId}" not found.`
      )
    }

    if (!action.details?.quantity) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Quantity to return of item ${refId} is required.`
      )
    }

    const quantityAvailable =
      (existing!.detail?.shipped_quantity ?? 0) -
      (existing!.detail?.return_requested_quantity ?? 0)

    if (action.details?.quantity > quantityAvailable) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot request to return more items than what was shipped for item ${refId}.`
      )
    }
  },
})
