import { MathBN, MedusaError, isDefined } from "@medusajs/utils"
import { ChangeActionType } from "../action-key"
import { OrderChangeProcessing } from "../calculate-order-change"

OrderChangeProcessing.registerActionType(ChangeActionType.WRITE_OFF_ITEM, {
  operation({ action, currentOrder }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )!

    existing.detail.written_off_quantity ??= 0
    existing.detail.written_off_quantity = MathBN.add(
      existing.detail.written_off_quantity,
      action.details.quantity
    )

    existing.detail.return_id = action.return_id
    existing.detail.swap_id = action.swap_id
    existing.detail.claim_id = action.claim_id
    existing.detail.exchange_id = action.exchange_id
  },
  revert({ action, currentOrder }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )!

    existing.detail.written_off_quantity = MathBN.sub(
      existing.detail.written_off_quantity,
      action.details.quantity
    )
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
        `Quantity to write-off item ${refId} is required.`
      )
    }

    const quantityAvailable = existing!.quantity ?? 0
    const greater = MathBN.gt(action.details?.quantity, quantityAvailable)
    if (greater) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cannot claim more items than what was ordered."
      )
    }
  },
})
