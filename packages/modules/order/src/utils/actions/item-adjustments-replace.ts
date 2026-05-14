import { ChangeActionType, MedusaError } from "@medusajs/framework/utils"
import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(
  ChangeActionType.ITEM_ADJUSTMENTS_REPLACE,
  {
    operation({ action, currentOrder, options }) {
      let existing = currentOrder.items.find(
        (item) => item.id === action.details.reference_id
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
          `Adjustments of item ${refId} must exist.`
        )
      }
    },
  }
)
