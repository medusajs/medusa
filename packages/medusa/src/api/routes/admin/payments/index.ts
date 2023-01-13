import { Router } from "express"
import "reflect-metadata"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"

import { Payment, Refund } from "../../../../models"
import { GetPaymentsParams } from "./get-payment"
import { AdminPostPaymentRefundsReq } from "./refund-payment"

const route = Router()

export default (app, container) => {
  app.use("/payments", route)

  route.get(
    "/:id",
    transformQuery(GetPaymentsParams, {
      defaultFields: defaultPaymentFields,
      isList: false,
    }),
    middlewares.wrap(require("./get-payment").default)
  )

  route.post(
    "/:id/capture",
    middlewares.wrap(require("./capture-payment").default)
  )

  route.post(
    "/:id/refund",
    transformBody(AdminPostPaymentRefundsReq),
    middlewares.wrap(require("./refund-payment").default)
  )

  return app
}

export const defaultPaymentFields = [
  "id",
  "swap_id",
  "cart_id",
  "order_id",
  "amount",
  "currency_code",
  "amount_refunded",
  "provider_id",
  "data",
  "captured_at",
  "canceled_at",
  "metadata",
]

/**
 * @schema AdminPaymentRes
 * type: object
 * properties:
 *   payment:
 *     $ref: "#/components/schemas/Payment"
 */
export type AdminPaymentRes = {
  payment: Payment
}

/**
 * @schema AdminRefundRes
 * type: object
 * properties:
 *   refund:
 *     $ref: "#/components/schemas/Refund"
 */
export type AdminRefundRes = {
  refund: Refund
}

export * from "./get-payment"
export * from "./refund-payment"
