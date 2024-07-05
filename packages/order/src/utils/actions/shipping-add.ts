import { MedusaError, isDefined } from "@medusajs/utils"
import { ChangeActionType } from "../action-key"
import { OrderChangeProcessing } from "../calculate-order-change"

OrderChangeProcessing.registerActionType(ChangeActionType.SHIPPING_ADD, {
  operation({ action, currentOrder }) {
    const shipping = Array.isArray(currentOrder.shipping_methods)
      ? currentOrder.shipping_methods
      : [currentOrder.shipping_methods]

    shipping.push({
      id: action.reference_id!,
      price: action.amount as number,
    })

    currentOrder.shipping_methods = shipping
  },
  revert({ action, currentOrder }) {
    const shipping = Array.isArray(currentOrder.shipping_methods)
      ? currentOrder.shipping_methods
      : [currentOrder.shipping_methods]

    const existingIndex = shipping.findIndex(
      (item) => item.id === action.reference_id
    )

    if (existingIndex > -1) {
      shipping.splice(existingIndex, 1)
    }
  },
  validate({ action }) {
    if (!action.reference_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Reference ID is required."
      )
    }

    if (!isDefined(action.amount)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Amount is required."
      )
    }
  },
})
