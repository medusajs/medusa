import middlewares, { transformStoreQuery } from "../../../middlewares"

import { Router } from "express"
import { PricedVariant } from "../../../../types/pricing"
import { extendRequestParams } from "../../../middlewares/publishable-api-key/extend-request-params"
import { validateSalesChannelParam } from "../../../middlewares/publishable-api-key/validate-sales-channel-param"
import { validateProductVariantSalesChannelAssociation } from "../../../middlewares/publishable-api-key/validate-variant-sales-channel-association"
import { withDefaultSalesChannel } from "../../../middlewares/with-default-sales-channel"
import { StoreGetVariantsVariantParams } from "./get-variant"
import { StoreGetVariantsParams } from "./list-variants"

const route = Router()

export default (app) => {
  app.use("/variants", extendRequestParams, validateSalesChannelParam, route)

  route.use("/:id", validateProductVariantSalesChannelAssociation)

  route.get(
    "/",
    withDefaultSalesChannel(),
    transformStoreQuery(StoreGetVariantsParams, {
      defaultRelations: defaultStoreVariantRelations,
      allowedRelations: allowedStoreVariantRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-variants").default)
  )
  route.get(
    "/:id",
    withDefaultSalesChannel(),
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
 * description: "The product variant's details."
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
 * description: "The list of product variants."
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

export * from "./get-variant"
export * from "./list-variants"
