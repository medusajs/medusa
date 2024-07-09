import { MathBN, MedusaError, isDefined } from "@medusajs/utils"
import { VirtualOrder } from "@types"
import { ChangeActionType } from "../action-key"
import { OrderChangeProcessing } from "../calculate-order-change"
import {
  setActionReference,
  unsetActionReference,
} from "../set-action-reference"

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
  revert({ action, currentOrder }) {
    const existing = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )

    if (existing) {
      existing.quantity = MathBN.add(existing.quantity, action.details.quantity)
      existing.detail.quantity = MathBN.add(
        existing.detail.quantity,
        action.details.quantity
      )

      unsetActionReference(existing, action)
    } else {
      currentOrder.items.push({
        id: action.details.reference_id!,
        unit_price: action.details.unit_price,
        quantity: action.details.quantity,
      } as VirtualOrder["items"][0])
    }
  },
  validate({ action, currentOrder }) {
    const refId = action.details?.reference_id
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
        `Item ID "${refId}" not found.`
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
