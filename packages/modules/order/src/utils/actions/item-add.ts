import { MathBN, MedusaError, isDefined } from "@medusajs/utils"
import { VirtualOrder } from "@types"
import { ChangeActionType } from "../action-key"
import { OrderChangeProcessing } from "../calculate-order-change"

OrderChangeProcessing.registerActionType(ChangeActionType.ITEM_ADD, {
  operation({ action, currentOrder }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.reference_id
    )

    if (existing) {
      existing.detail.quantity ??= 0

      existing.quantity = MathBN.add(existing.quantity, action.details.quantity)

      existing.detail.quantity = MathBN.add(
        existing.detail.quantity,
        action.details.quantity
      )

      existing.detail.return_id = action.return_id
      existing.detail.swap_id = action.swap_id
      existing.detail.claim_id = action.claim_id
      existing.detail.exchange_id = action.exchange_id
    } else {
      currentOrder.items.push({
        id: action.reference_id!,
        order_id: currentOrder.id,
        return_id: action.details.return_id,
        swap_id: action.details.swap_id,
        claim_id: action.details.claim_id,
        exchange_id: action.details.exchange_id,

        unit_price: action.details.unit_price,
        quantity: action.details.quantity,
      } as VirtualOrder["items"][0])
    }

    return MathBN.mult(action.details.unit_price, action.details.quantity)
  },
  revert({ action, currentOrder }) {
    const existingIndex = currentOrder.items.findIndex(
      (item) => item.id === action.reference_id
    )

    if (existingIndex > -1) {
      const existing = currentOrder.items[existingIndex]
      existing.quantity = MathBN.sub(existing.quantity, action.details.quantity)
      existing.detail.quantity = MathBN.sub(
        existing.detail.quantity,
        action.details.quantity
      )

      if (MathBN.lte(existing.quantity, 0)) {
        currentOrder.items.splice(existingIndex, 1)
      }
    }
  },
  validate({ action }) {
    const refId = action.reference_id
    if (!isDefined(action.reference_id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Reference ID is required."
      )
    }

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
