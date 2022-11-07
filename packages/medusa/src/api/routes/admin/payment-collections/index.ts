import { Router } from "express"
import "reflect-metadata"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { AdminCreatePaymentCollectionRequest } from "./create-payment-collection"
import OrderEditingFeatureFlag from "../../../../loaders/feature-flags/order-editing"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"

import { GetPaymentCollectionsParams } from "./get-payment-collection"
import { AdminUpdatePaymentCollectionRequest } from "./update-payment-collection"
import { AdminPostPaymentCollectionRefundsReq } from "./refund-payment"

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

  route.delete(
    "/:id",
    middlewares.wrap(require("./delete-payment-collection").default)
  )

  route.post(
    "/payments/:payment_id/capture",
    middlewares.wrap(require("./capture-payment").default)
  )

  route.post(
    "/payments/:payment_id/refund",
    transformBody(AdminPostPaymentCollectionRefundsReq),
    middlewares.wrap(require("./refund-payment").default)
  )

  return app
}

export const defaultPaymentCollectionFields = [
  "id",
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
export * from "./create-payment-collection"
