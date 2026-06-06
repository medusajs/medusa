import { ChangeActionType } from "@zjedene-medusa/framework/utils"

import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(
  ChangeActionType.UPDATE_ORDER_PROPERTIES,
  {
    operation({ action, currentOrder, options }) {
      /**
       * NOOP: used as a reference for the change
       */

      setActionReference(currentOrder, action, options)
    },
    validate({ action }) {
      /* noop */
    },
  }
)
