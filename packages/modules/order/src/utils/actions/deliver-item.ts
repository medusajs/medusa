import {
  ChangeActionType,
  MathBN,
  MedusaError,
} from "@medusajs/framework/utils"
import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(ChangeActionType.DELIVER_ITEM, {
  operation({ action, currentOrder, options }) {
    const item = currentOrder.items.find(
      (item) => item.id === action.details.reference_id
    )!

    item.detail.delivered_quantity ??= 0

    item.detail.delivered_quantity = MathBN.add(
      item.detail.delivered_quantity,
      action.details.quantity
    )

    setActionReference(item, action, options)
  },
  validate({ action, currentOrder }) {
    const refId = action.details?.reference_id

    if (refId == null) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Reference ID is required."
      )
    }

    const item = currentOrder.items.find((item) => item.id === refId)

    if (!item) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Item ID "${refId}" not found.`
      )
    }

    const totalDeliverable = MathBN.convert(item.quantity)
    const totalDelivered = MathBN.convert(item.detail?.delivered_quantity)
    const newDelivered = MathBN.convert(action.details?.quantity ?? 0)
    const newTotalDelivered = MathBN.sum(totalDelivered, newDelivered)

    const totalFulfilled = MathBN.convert(item.detail?.fulfilled_quantity)

    if (MathBN.lte(newDelivered, 0)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Quantity of item ${refId} must be greater than 0.`
      )
    }

    if (MathBN.gt(newTotalDelivered, totalFulfilled)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot deliver more items than what was fulfilled for item ${refId}.`
      )
    }

    if (MathBN.gt(newTotalDelivered, totalDeliverable)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot deliver more items than what was ordered for item ${refId}.`
      )
    }
  },
})
