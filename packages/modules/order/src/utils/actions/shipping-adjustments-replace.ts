import { ChangeActionType, MedusaError } from "@medusajs/framework/utils"
import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(
  ChangeActionType.SHIPPING_ADJUSTMENTS_REPLACE,
  {
    operation({ action, currentOrder, options }) {
      let existing = currentOrder.shipping_methods.find(
        (method) => method.id === action.details.reference_id
      )

      if (!existing) {
        return
      }

      existing.adjustments = action.details.adjustments ?? []

      setActionReference(existing, action, options)
    },
    validate({ action }) {
      const refId = action.details?.reference_id

      if (!action.details.adjustments) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Adjustments of shipping method ${refId} must exist.`
        )
      }
    },
  }
)
