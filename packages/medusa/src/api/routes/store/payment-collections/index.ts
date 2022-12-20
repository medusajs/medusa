import { Router } from "express"
import "reflect-metadata"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"

import OrderEditingFeatureFlag from "../../../../loaders/feature-flags/order-editing"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"

import { StorePostPaymentCollectionsBatchSessionsReq } from "./manage-batch-payment-sessions"
import { GetPaymentCollectionsParams } from "./get-payment-collection"
import { PaymentCollection, PaymentSession } from "../../../../models"
import { StorePaymentCollectionSessionsReq } from "./manage-payment-session"
import { StorePostPaymentCollectionsBatchSessionsAuthorizeReq } from "./authorize-batch-payment-sessions"

const route = Router()

export default (app, container) => {
  app.use(
    "/payment-collections",
    isFeatureFlagEnabled(OrderEditingFeatureFlag.key),
    route
  )

  route.get(
    "/:id",
    transformQuery(GetPaymentCollectionsParams, {
      defaultFields: defaultPaymentCollectionFields,
      defaultRelations: defaulPaymentCollectionRelations,
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

export const defaulPaymentCollectionRelations = ["region", "payment_sessions"]

export type StorePaymentCollectionsRes = {
  payment_collection: PaymentCollection
}

export type StorePaymentCollectionsSessionRes = {
  payment_session: PaymentSession
}

export * from "./get-payment-collection"
export * from "./manage-payment-session"
export * from "./manage-batch-payment-sessions"
export * from "./refresh-payment-session"
export * from "./authorize-batch-payment-sessions"
