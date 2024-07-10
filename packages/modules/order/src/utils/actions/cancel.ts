import { ChangeActionType } from "@medusajs/utils"
import { OrderChangeProcessing } from "../calculate-order-change"

OrderChangeProcessing.registerActionType(ChangeActionType.CANCEL, {
  void: true,
})
