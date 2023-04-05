import { Router } from "express"
import middlewares from "../../../middlewares"
import { PricedShippingOption } from "../../../../types/pricing"

const route = Router()

export default (app) => {
  app.use("/shipping-options", route)

  route.get("/", middlewares.wrap(require("./list-options").default))
  route.get(
    "/:cart_id",
    middlewares.wrap(require("./list-shipping-options").default)
  )

  return app
}

export const defaultRelations = ["requirements"]

/**
 * @schema StoreShippingOptionsListRes
 * type: object
 * x-expanded-relations:
 *   field: shipping_options
 *   relations:
 *     - requirements
 * required:
 *   - shipping_options
 * properties:
 *   shipping_options:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/PricedShippingOption"
 */
export type StoreShippingOptionsListRes = {
  shipping_options: PricedShippingOption[]
}

/**
 * @schema StoreCartShippingOptionsListRes
 * type: object
 * x-expanded-relations:
 *   field: shipping_options
 *   implicit:
 *     - profile
 *     - requirements
 * required:
 *   - shipping_options
 * properties:
 *   shipping_options:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/PricedShippingOption"
 */
export type StoreCartShippingOptionsListRes = {
  shipping_options: PricedShippingOption[]
}

export * from "./list-options"
export * from "./list-shipping-options"
