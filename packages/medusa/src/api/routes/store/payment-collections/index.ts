import { Router } from "express"
import "reflect-metadata"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"

import OrderEditingFeatureFlag from "../../../../loaders/feature-flags/order-editing"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"

import { AdminManagePaymentCollectionSessionRequest } from "./manage-payment-sessions"
import { AdminRefreshPaymentCollectionSessionRequest } from "./refresh-payment-session"
import { GetPaymentCollectionsParams } from "./get-payment-collection"

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
    "/:id/authorize",
    middlewares.wrap(require("./authorize-payment-collection").default)
  )

  route.post(
    "/:id/sessions",
    transformBody(AdminManagePaymentCollectionSessionRequest),
    middlewares.wrap(require("./manage-payment-sessions").default)
  )

  route.post(
    "/:id/sessions/:session_id/refresh",
    transformBody(AdminRefreshPaymentCollectionSessionRequest),
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

export * from "./get-payment-collection"
export * from "./manage-payment-sessions"
export * from "./refresh-payment-session"
