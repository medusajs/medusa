import { Router } from "express"
import "reflect-metadata"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { AdminCreatePaymentCollectionRequest } from "./create-payment-collection"
import OrderEditingFeatureFlag from "../../../../loaders/feature-flags/order-editing"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"

import { AdminManagePaymentCollectionSessionRequest } from "./manage-payment-session"
import { AdminRefreshPaymentCollectionSessionRequest } from "./refresh-payment-session"
import { GetPaymentCollectionsParams } from "./get-payment-collection"
import { AdminUpdatePaymentCollectionRequest } from "./update-payment-collection"

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
    "/",
    transformBody(AdminCreatePaymentCollectionRequest),
    middlewares.wrap(require("./create-payment-collection").default)
  )

  route.post(
    "/:id",
    transformBody(AdminUpdatePaymentCollectionRequest),
    middlewares.wrap(require("./update-payment-collection").default)
  )

  route.post(
    "/:id/sessions",
    transformBody(AdminManagePaymentCollectionSessionRequest),
    middlewares.wrap(require("./manage-payment-session").default)
  )

  route.post(
    "/:id/sessions/:session_id/refresh",
    transformBody(AdminRefreshPaymentCollectionSessionRequest),
    middlewares.wrap(require("./refresh-payment-session").default)
  )

  route.post(
    ":id/payments/capture",
    middlewares.wrap(require("./capture-all-payment-collection").default)
  )

  route.post(
    "/payments/:payment_id/capture",
    middlewares.wrap(require("./capture-payment").default)
  )

  return app
}

export const defaultPaymentCollectionFields = [
  "type",
  "status",
  "description",
  "amount",
  "authorized_amount",
  "captured_amount",
  "refunded_amount",
  "region",
  "currency_code",
  "currency",
  "metadata",
]

export const defaulPaymentCollectionRelations = [
  "region",
  "payment_sessions",
  "payments",
]

export * from "./get-payment-collection"
export * from "./create-payment-collection"
export * from "./update-payment-collection"
export * from "./manage-payment-session"
export * from "./refresh-payment-session"
