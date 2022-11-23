import { Router } from "express"
import "reflect-metadata"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import OrderEditingFeatureFlag from "../../../../loaders/feature-flags/order-editing"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"

import { GetPaymentCollectionsParams } from "./get-payment-collection"
import { AdminUpdatePaymentCollectionRequest } from "./update-payment-collection"
import { PaymentCollection } from "../../../../models"

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
    "/:id",
    transformBody(AdminUpdatePaymentCollectionRequest),
    middlewares.wrap(require("./update-payment-collection").default)
  )

  route.post(
    "/:id/authorize",
    middlewares.wrap(require("./mark-authorized-payment-collection").default)
  )

  route.delete(
    "/:id",
    middlewares.wrap(require("./delete-payment-collection").default)
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

export type AdminPaymentCollectionRes = {
  payment_collection: PaymentCollection
}
export type AdminPaymentCollectionDeleteRes = {
  id: string
  object: "payment_collection"
  deleted: boolean
}

export * from "./get-payment-collection"
export * from "./update-payment-collection"
