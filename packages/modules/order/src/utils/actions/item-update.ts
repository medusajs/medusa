import {
  BigNumber,
  ChangeActionType,
  MathBN,
  MedusaError,
} from "@medusajs/framework/utils"
import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(ChangeActionType.ITEM_UPDATE, {
  operation({ action, currentOrder, options }) {
    const existingIndex = currentOrder.items.findIndex(
      (item) => item.id === action.details.reference_id
    )

    const unitPrice = action.details.unit_price
    const existing = currentOrder.items[existingIndex]

    existing.detail.quantity ??= 0

    let quantityDiff = MathBN.sub(
      action.details.quantity,
      existing.detail.quantity
    )

    const quant = new BigNumber(action.details.quantity)
    existing.quantity = quant
    existing.detail.quantity = quant

    if (unitPrice) {
      const currentUnitPriceBN = MathBN.convert(unitPrice)
      const originalUnitPriceBn = MathBN.convert(
        existing.detail.unit_price ?? existing.unit_price
      )

      const currentQuantityBn = MathBN.convert(action.details.quantity)
      const originalQuantityBn = MathBN.convert(
        existing.detail.quantity ?? existing.quantity
      )

      const originalTotal = MathBN.mult(originalUnitPriceBn, originalQuantityBn)
      const currentTotal = MathBN.mult(currentUnitPriceBN, currentQuantityBn)

      existing.unit_price = currentUnitPriceBN
      existing.detail.unit_price = currentUnitPriceBN

      setActionReference(existing, action, options)

      return MathBN.sub(currentTotal, originalTotal)
    }

    setActionReference(existing, action, options)
    return MathBN.mult(existing.unit_price, quantityDiff)
  },
  validate({ action, currentOrder }) {
    const refId = action.details?.reference_id
    if (refId == null) {
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

    if (action.details?.quantity == null) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Quantity of item ${refId} is required.`
      )
    }

    action.details.quantity ??= 0

    const lower = MathBN.lt(
      action.details.quantity,
      existing.detail?.fulfilled_quantity
    )

    if (lower) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Item ${refId} has already been fulfilled and quantity cannot be lower than ${existing.detail?.fulfilled_quantity}.`
      )
    }
  },
})
