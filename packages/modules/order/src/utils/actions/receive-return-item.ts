import {
  ChangeActionType,
  MathBN,
  MedusaError,
  isDefined,
} from "@medusajs/utils"
import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(ChangeActionType.RECEIVE_RETURN_ITEM, {
  isDeduction: true,
  operation({ action, currentOrder, previousEvents, options }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )!

    let toReturn = action.details.quantity

    existing.detail.return_received_quantity ??= 0
    existing.detail.return_requested_quantity ??= 0

    existing.detail.return_received_quantity = MathBN.add(
      existing.detail.return_received_quantity,
      toReturn
    )
    existing.detail.return_requested_quantity = MathBN.sub(
      existing.detail.return_requested_quantity,
      toReturn
    )

    setActionReference(existing, action, options)

    return MathBN.mult(existing.unit_price, action.details.quantity)
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
        `Quantity to receive return of item ${refId} is required.`
      )
    }

    const quantityRequested = existing?.detail?.return_requested_quantity || 0

    const greater = MathBN.gt(action.details?.quantity, quantityRequested)
    if (greater) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot receive more items than what was requested to be returned for item ${refId}.`
      )
    }
  },
})
