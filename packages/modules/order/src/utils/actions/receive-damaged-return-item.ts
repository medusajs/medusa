import { ChangeActionType, MathBN, MedusaError } from "@medusajs/utils"
import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(
  ChangeActionType.RECEIVE_DAMAGED_RETURN_ITEM,
  {
    isDeduction: true,
    operation({ action, currentOrder, previousEvents, options }) {
      const existing = currentOrder.items.find(
        (item) => item.id === action.details.reference_id
      )!

      let toReturn = action.details.quantity

      existing.detail.return_dismissed_quantity ??= 0
      existing.detail.return_requested_quantity ??= 0

      existing.detail.return_dismissed_quantity = MathBN.add(
        existing.detail.return_dismissed_quantity,
        toReturn
      )
      existing.detail.return_requested_quantity = MathBN.sub(
        existing.detail.return_requested_quantity,
        toReturn
      )

      existing.detail.written_off_quantity ??= 0
      existing.detail.written_off_quantity = MathBN.add(
        existing.detail.written_off_quantity,
        action.details.quantity
      )

      setActionReference(existing, action, options)

      return MathBN.mult(existing.unit_price, action.details.quantity)
    },
    validate({ action, currentOrder }) {
      const refId = action.details?.reference_id
      if (refId == null) {
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

      const quantityRequested = existing?.detail.return_requested_quantity || 0
      if (action.details?.quantity > quantityRequested) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Cannot receive more items than what was requested to be returned for item ${refId}.`
        )
      }
    },
  }
)
