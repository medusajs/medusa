import { ProductVariant } from "../../../../"
import { RequestHandler, Router } from "express"
import middlewares from "../../../middlewares"
import { featureFlagRouter } from "../../../../loaders/feature-flags"
import PublishableAPIKeysFeatureFlag from "../../../../loaders/feature-flags/publishable-api-keys"
import { extendRequestParams } from "../../../middlewares/publishable-api-key/extend-request-params"
import { validateSalesChannelParam } from "../../../middlewares/publishable-api-key/validate-sales-channel-param"
import { validateProductVariantSalesChannelAssociation } from "../../../middlewares/publishable-api-key/validate-variant-sales-channel-association"

const route = Router()

export default (app) => {
  app.use("/variants", route)

  if (featureFlagRouter.isFeatureEnabled(PublishableAPIKeysFeatureFlag.key)) {
    route.use(
      "/",
      extendRequestParams as unknown as RequestHandler,
      validateSalesChannelParam as unknown as RequestHandler
    )
    route.use("/:id", validateProductVariantSalesChannelAssociation)
  }

  route.get("/", middlewares.wrap(require("./list-variants").default))
  route.get("/:id", middlewares.wrap(require("./get-variant").default))

  return app
}

export const defaultStoreVariantRelations = ["prices", "options"]

/**
 * @schema StoreVariantsRes
 * type: object
 * properties:
 *   variant:
 *     $ref: "#/components/schemas/PricedVariant"
 */
export type StoreVariantsRes = {
  variant: ProductVariant
}

/**
 * @schema StoreVariantsListRes
 * type: object
 * properties:
 *   variants:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/PricedVariant"
 */
export type StoreVariantsListRes = {
  variants: ProductVariant[]
}

export * from "./list-variants"
export * from "./get-variant"
