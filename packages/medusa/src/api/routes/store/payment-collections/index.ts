import { Router } from "express"
import "reflect-metadata"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"

import OrderEditingFeatureFlag from "../../../../loaders/feature-flags/order-editing"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"

import { StoreManageMultiplePaymentCollectionSessionRequest } from "./manage-multiple-payment-sessions"
import { GetPaymentCollectionsParams } from "./get-payment-collection"
import { PaymentCollection, PaymentSession } from "../../../../models"
import { StoreManagePaymentCollectionSessionRequest } from "./manage-payment-session"

const route = Router()

export default (app, container) => {
  app.use(
    "/payment-collections",
    isFeatureFlagEnabled(OrderEditingFeatureFlag.key),
    route
  )

  // Authenticated endpoints
  route.use(middlewares.requireCustomerAuthentication())

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
    "/:id/authorize",
    middlewares.wrap(require("./authorize-payment-collection").default)
  )

  route.post(
    "/:id/session",
    transformBody(StoreManagePaymentCollectionSessionRequest),
    middlewares.wrap(require("./manage-payment-session").default)
  )

  route.post(
    "/:id/multiple-sessions",
    transformBody(StoreManageMultiplePaymentCollectionSessionRequest),
    middlewares.wrap(require("./manage-multiple-payment-sessions").default)
  )

  route.post(
    "/:id/sessions/:session_id/refresh",
    middlewares.wrap(require("./refresh-payment-session").default)
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

export type StorePaymentCollectionRes = {
  payment_collection: PaymentCollection
}

export type StorePaymentCollectionSessionRes = {
  payment_session: PaymentSession
}

export * from "./get-payment-collection"
export * from "./manage-payment-session"
export * from "./manage-multiple-payment-sessions"
export * from "./refresh-payment-session"
