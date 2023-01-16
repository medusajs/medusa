import { Router } from "express"
import { ShippingOption } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"
import { FlagRouter } from "../../../../utils/flag-router"
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  app.use("/shipping-options", route)

  if (featureFlagRouter.isFeatureEnabled(TaxInclusivePricingFeatureFlag.key)) {
    defaultFields.push("includes_tax")
  }

  route.get("/", middlewares.wrap(require("./list-shipping-options").default))
  route.post("/", middlewares.wrap(require("./create-shipping-option").default))

  route.get(
    "/:option_id",
    middlewares.wrap(require("./get-shipping-option").default)
  )
  route.post(
    "/:option_id",
    middlewares.wrap(require("./update-shipping-option").default)
  )
  route.delete(
    "/:option_id",
    middlewares.wrap(require("./delete-shipping-option").default)
  )

  return app
}

export const defaultFields = [
  "id",
  "name",
  "region_id",
  "profile_id",
  "provider_id",
  "price_type",
  "amount",
  "is_return",
  "admin_only",
  "data",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const defaultRelations = ["region", "profile", "requirements"]

/**
 * @schema AdminShippingOptionsListRes
 * type: object
 * properties:
 *   shipping_options:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ShippingOption"
 *   count:
 *     type: integer
 *     description: The total number of items available
 */
export type AdminShippingOptionsListRes = PaginatedResponse & {
  shipping_options: ShippingOption[]
}

/**
 * @schema AdminShippingOptionsRes
 * type: object
 * properties:
 *   shipping_option:
 *     $ref: "#/components/schemas/ShippingOption"
 */
export type AdminShippingOptionsRes = {
  shipping_option: ShippingOption
}

/**
 * @schema AdminShippingOptionsDeleteRes
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Shipping Option.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: shipping-option
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminShippingOptionsDeleteRes = DeleteResponse

export * from "./create-shipping-option"
export * from "./delete-shipping-option"
export * from "./get-shipping-option"
export * from "./list-shipping-options"
export * from "./update-shipping-option"
