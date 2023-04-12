import { DecoratedVariant } from "../../../../types/product-variant"
import { Router } from "express"
import { extendRequestParams } from "../../../middlewares/publishable-api-key/extend-request-params"
import middlewares from "../../../middlewares"
import { validateProductVariantSalesChannelAssociation } from "../../../middlewares/publishable-api-key/validate-variant-sales-channel-association"
import { validateSalesChannelParam } from "../../../middlewares/publishable-api-key/validate-sales-channel-param"

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
 * required:
 *   - variant
 * properties:
 *   variant:
 *     $ref: "#/components/schemas/DecoratedVariant"
 */
export type StoreVariantsRes = {
  variant: DecoratedVariant
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
 * required:
 *   - variants
 * properties:
 *   variants:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/DecoratedVariant"
 */
export type StoreVariantsListRes = {
  variants: DecoratedVariant[]
}

export * from "./list-variants"
export * from "./get-variant"
