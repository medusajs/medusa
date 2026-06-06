import { ChangeActionType, MedusaError } from "@zjedene-medusa/framework/utils"
import { OrderChangeProcessing } from "../calculate-order-change"

OrderChangeProcessing.registerActionType(ChangeActionType.PROMOTION_ADD, {
  operation({ action, currentOrder, options }) {
    // no-op
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
