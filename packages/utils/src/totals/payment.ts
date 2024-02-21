import { BigNumber, BigNumber as BigNumberJs } from "bignumber.js"

import {
  BigNumberRawValue,
  CaptureDTO,
  PaymentDTO,
  RefundDTO,
} from "@medusajs/types"

type WithRawAmount<T> = T & { raw_amount: BigNumberRawValue }

type PaymentWithAmount = Omit<
  PaymentDTO,
  "refunds" | "refunded_amount" | "captures" | "captured_amount"
> & {
  refunds: WithRawAmount<RefundDTO>[]
  captures: WithRawAmount<CaptureDTO>[]

  captured_amount: BigNumber
  refunded_amount: BigNumber
}

export function decoratePaymentAmounts(payment: PaymentWithAmount) {
  payment.captured_amount = payment.captures.reduce((acc, capture) => {
    return acc.plus(BigNumberJs(capture.raw_amount.value))
  }, BigNumberJs(0))

  payment.refunded_amount = payment.refunds.reduce((acc, refund) => {
    return acc.plus(BigNumberJs(refund.raw_amount.value))
  }, BigNumberJs(0))

  return payment
}
