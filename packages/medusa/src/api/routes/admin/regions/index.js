import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/regions", route)

  route.get("/", middlewares.wrap(require("./list-regions").default))
  route.get("/:region_id", middlewares.wrap(require("./get-region").default))

  route.get(
    "/:region_id/fulfillment-options",
    middlewares.wrap(require("./get-fulfillment-options").default)
  )

  route.post("/", middlewares.wrap(require("./create-region").default))
  route.post(
    "/:region_id",
    middlewares.wrap(require("./update-region").default)
  )

  route.delete(
    "/:region_id",
    middlewares.wrap(require("./delete-region").default)
  )

  route.post(
    "/:region_id/countries",
    middlewares.wrap(require("./add-country").default)
  )
  route.delete(
    "/:region_id/countries/:country_code",
    middlewares.wrap(require("./remove-country").default)
  )

  route.post(
    "/:region_id/payment-providers",
    middlewares.wrap(require("./add-payment-provider").default)
  )
  route.delete(
    "/:region_id/payment-providers/:provider_id",
    middlewares.wrap(require("./remove-payment-provider").default)
  )

  route.post(
    "/:region_id/fulfillment-providers",
    middlewares.wrap(require("./add-fulfillment-provider").default)
  )
  route.delete(
    "/:region_id/fulfillment-providers/:provider_id",
    middlewares.wrap(require("./remove-fulfillment-provider").default)
  )

  /**
   * Set metadata key / value pair.
   */
  route.post(
    "/:id/metadata",
    middlewares.wrap(require("./set-metadata").default)
  )

  /**
   * Delete metadata key / value pair.
   */
  route.delete(
    "/:id/metadata/:key",
    middlewares.wrap(require("./delete-metadata").default)
  )

  return app
}

export const defaultFields = [
  "id",
  "name",
  "currency_code",
  "tax_rate",
  "tax_code",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const defaultRelations = [
  "countries",
  "payment_providers",
  "fulfillment_providers",
]
