import {
  ChangeActionType,
  MathBN,
  MedusaError,
} from "@zjedene-medusa/framework/utils"
import { CreateOrderCreditLineDTO, OrderCreditLineDTO } from "@zjedene-medusa/types"
import { OrderChangeProcessing } from "../calculate-order-change"
import { setActionReference } from "../set-action-reference"

OrderChangeProcessing.registerActionType(ChangeActionType.CREDIT_LINE_ADD, {
  operation({ action, currentOrder, options }) {
    const creditLines: (OrderCreditLineDTO | CreateOrderCreditLineDTO)[] =
      currentOrder.credit_lines ?? []
    const existing = creditLines.find(
      (cl) => "id" in cl && cl?.id === action.reference_id
    )

    if (existing) {
      return
    }

    const newCreditLine = {
      order_id: currentOrder.id,
      amount: MathBN.convert(action.amount!),
      reference: action.reference!,
      reference_id: action.reference_id!,
    }

    creditLines.push(newCreditLine)

    setActionReference(newCreditLine, action, options)

    currentOrder.credit_lines = creditLines
  },
  validate({ action }) {
    if (action.amount == null) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Amount is required."
      )
    }
  },
})
