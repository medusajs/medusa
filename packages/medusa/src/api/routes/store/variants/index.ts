import { Router } from "express"
import { extendRequestParams } from "../../../middlewares/publishable-api-key/extend-request-params"
import middlewares from "../../../middlewares"
import { validateProductVariantSalesChannelAssociation } from "../../../middlewares/publishable-api-key/validate-variant-sales-channel-association"
import { validateSalesChannelParam } from "../../../middlewares/publishable-api-key/validate-sales-channel-param"
import { PricedVariant } from "../../../../types/pricing"

const route = Router()

export default (app) => {
  app.use("/variants", extendRequestParams, validateSalesChannelParam, route)

  route.use("/:id", validateProductVariantSalesChannelAssociation)

  route.get("/", middlewares.wrap(require("./list-variants").default))
  route.get("/:id", middlewares.wrap(require("./get-variant").default))

  return app
}

export const defaultStoreVariantRelations = ["prices", "options", "product"]

/**
 * @schema StoreVariantsRes
 * type: object
 * x-expanded-relations:
 *   field: variant
 *   relations:
 *     - prices
 *     - options
 *     - product
 *   totals:
 *     - purchasable
 * required:
 *   - variant
 * properties:
 *   variant:
 *     $ref: "#/components/schemas/PricedVariant"
 */
export type StoreVariantsRes = {
  variant: PricedVariant
}

/**
 * @schema StoreVariantsListRes
 * type: object
 * x-expanded-relations:
 *   field: variants
 *   relations:
 *     - prices
 *     - options
 *     - product
 *   totals:
 *     - purchasable
 * required:
 *   - variants
 * properties:
 *   variants:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/PricedVariant"
 */
export type StoreVariantsListRes = {
  variants: PricedVariant[]
}

export * from "./list-variants"
export * from "./get-variant"
