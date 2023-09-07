import middlewares, { transformStoreQuery } from "../../../middlewares"

import { PricedVariant } from "../../../../types/pricing"
import { Router } from "express"
import { StoreGetVariantsParams } from "./list-variants"
import { StoreGetVariantsVariantParams } from "./get-variant"
import { extendRequestParams } from "../../../middlewares/publishable-api-key/extend-request-params"
import { validateProductVariantSalesChannelAssociation } from "../../../middlewares/publishable-api-key/validate-variant-sales-channel-association"
import { validateSalesChannelParam } from "../../../middlewares/publishable-api-key/validate-sales-channel-param"

const route = Router()

export default (app) => {
  app.use("/variants", extendRequestParams, validateSalesChannelParam, route)

  route.use("/:id", validateProductVariantSalesChannelAssociation)

  route.get(
    "/",
    transformStoreQuery(StoreGetVariantsParams, {
      defaultRelations: defaultStoreVariantRelations,
      allowedRelations: allowedStoreVariantRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-variants").default)
  )
  route.get(
    "/:id",
    transformStoreQuery(StoreGetVariantsVariantParams, {
      defaultRelations: defaultStoreVariantRelations,
      allowedRelations: allowedStoreVariantRelations,
    }),
    middlewares.wrap(require("./get-variant").default)
  )

  return app
}

export const defaultStoreVariantRelations = ["prices", "options", "product"]

export const allowedStoreVariantRelations = [
  ...defaultStoreVariantRelations,
  "inventory_items",
]
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
 *     description: "Product variant description."
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
 *     description: "An array of product variant descriptions."
 *     items:
 *       $ref: "#/components/schemas/PricedVariant"
 */
export type StoreVariantsListRes = {
  variants: PricedVariant[]
}

export * from "./list-variants"
export * from "./get-variant"
