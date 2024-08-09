import { ChangeActionType, MedusaError } from "@medusajs/utils"
import { OrderChangeProcessing } from "../calculate-order-change"

OrderChangeProcessing.registerActionType(ChangeActionType.SHIPPING_REMOVE, {
  operation({ action, currentOrder, options }) {
    const shipping = Array.isArray(currentOrder.shipping_methods)
      ? currentOrder.shipping_methods
      : [currentOrder.shipping_methods]

    const existingIndex = shipping.findIndex(
      (item) => item.id === action.reference_id
    )

    if (existingIndex > -1) {
      shipping.splice(existingIndex, 1)
    }

    currentOrder.shipping_methods = shipping
  },
  validate({ action }) {
    if (!action.reference_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Reference ID is required."
      )
    }
  },
})
