import { Router } from "express"
import "reflect-metadata"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"

import { PaymentCollection, PaymentSession } from "../../../../models"
import { StorePostPaymentCollectionsBatchSessionsAuthorizeReq } from "./authorize-batch-payment-sessions"
import { GetPaymentCollectionsParams } from "./get-payment-collection"
import { StorePostPaymentCollectionsBatchSessionsReq } from "./manage-batch-payment-sessions"
import { StorePaymentCollectionSessionsReq } from "./manage-payment-session"

const route = Router()

export default (app, container) => {
  app.use("/payment-collections", route)

  route.get(
    "/:id",
    transformQuery(GetPaymentCollectionsParams, {
      defaultFields: defaultPaymentCollectionFields,
      defaultRelations: defaultPaymentCollectionRelations,
      isList: false,
    }),
    middlewares.wrap(require("./get-payment-collection").default)
  )

  route.post(
    "/:id/sessions/batch",
    transformBody(StorePostPaymentCollectionsBatchSessionsReq),
    middlewares.wrap(require("./manage-batch-payment-sessions").default)
  )

  route.post(
    "/:id/sessions/batch/authorize",
    transformBody(StorePostPaymentCollectionsBatchSessionsAuthorizeReq),
    middlewares.wrap(require("./authorize-batch-payment-sessions").default)
  )

  route.post(
    "/:id/sessions",
    transformBody(StorePaymentCollectionSessionsReq),
    middlewares.wrap(require("./manage-payment-session").default)
  )

  route.post(
    "/:id/sessions/:session_id",
    middlewares.wrap(require("./refresh-payment-session").default)
  )

  route.post(
    "/:id/sessions/:session_id/authorize",
    middlewares.wrap(require("./authorize-payment-session").default)
  )

  return app
}

export const defaultPaymentCollectionFields = [
  "id",
  "type",
  "status",
  "description",
  "amount",
  "region",
  "currency_code",
  "currency",
  "metadata",
]

export const defaultPaymentCollectionRelations = ["region", "payment_sessions"]

/**
 * @schema StorePaymentCollectionsRes
 * type: object
 * properties:
 *   payment_collection:
 *     $ref: "#/components/schemas/PaymentCollection"
 */
export type StorePaymentCollectionsRes = {
  payment_collection: PaymentCollection
}

/**
 * @schema StorePaymentCollectionsSessionRes
 * type: object
 * properties:
 *   payment_session:
 *     $ref: "#/components/schemas/PaymentSession"
 */
export type StorePaymentCollectionsSessionRes = {
  payment_session: PaymentSession
}

export * from "./authorize-batch-payment-sessions"
export * from "./get-payment-collection"
export * from "./manage-batch-payment-sessions"
export * from "./manage-payment-session"
export * from "./refresh-payment-session"
