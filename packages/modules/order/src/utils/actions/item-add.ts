import {
  ChangeActionType,
  MathBN,
  MedusaError,
  isDefined,
} from "@medusajs/utils"
import { VirtualOrder } from "@types"
import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(ChangeActionType.ITEM_ADD, {
  operation({ action, currentOrder, options }) {
    let existing = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )

    if (existing) {
      existing.detail.quantity ??= 0

      existing.quantity = MathBN.add(existing.quantity, action.details.quantity)

      existing.detail.quantity = MathBN.add(
        existing.detail.quantity,
        action.details.quantity
      )
    } else {
      existing = {
        id: action.details.reference_id!,
        order_id: currentOrder.id,
        return_id: action.return_id,
        claim_id: action.claim_id,
        exchange_id: action.exchange_id,

        unit_price: action.details.unit_price,
        quantity: action.details.quantity,
      } as VirtualOrder["items"][0]

      currentOrder.items.push(existing)
    }

    setActionReference(existing, action, options)

    return MathBN.mult(action.details.unit_price, action.details.quantity)
  },
  validate({ action }) {
    const refId = action.details?.reference_id

    if (!isDefined(action.amount) && !isDefined(action.details?.unit_price)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Unit price of item ${refId} is required if no action.amount is provided.`
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
  },
})
