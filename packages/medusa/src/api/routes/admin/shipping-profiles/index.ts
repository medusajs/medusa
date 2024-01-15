import { Router } from "express"
import "reflect-metadata"
import { ShippingProfile } from "../../../.."
import { DeleteResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/shipping-profiles", route)

  route.get("/", middlewares.wrap(require("./list-shipping-profiles").default))
  route.post(
    "/",
    middlewares.wrap(require("./create-shipping-profile").default)
  )

  route.get(
    "/:profile_id",
    middlewares.wrap(require("./get-shipping-profile").default)
  )
  route.post(
    "/:profile_id",
    middlewares.wrap(require("./update-shipping-profile").default)
  )
  route.delete(
    "/:profile_id",
    middlewares.wrap(require("./delete-shipping-profile").default)
  )

  return app
}

export const defaultAdminShippingProfilesFields: (keyof ShippingProfile)[] = [
  "id",
  "name",
  "type",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const defaultAdminShippingProfilesRelations: string[] = [
  "products.profiles",
  "shipping_options",
]

/**
 * @schema AdminDeleteShippingProfileRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Shipping Profile.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: shipping_profile
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminDeleteShippingProfileRes = DeleteResponse

/**
 * @schema AdminShippingProfilesRes
 * type: object
 * description: "The shipping profile's details."
 * x-expanded-relations:
 *   field: shipping_profile
 *   relations:
 *     - products
 *     - shipping_options
 * required:
 *   - shipping_profile
 * properties:
 *   shipping_profile:
 *     description: Shipping profile details.
 *     $ref: "#/components/schemas/ShippingProfile"
 */
export type AdminShippingProfilesRes = {
  shipping_profile: ShippingProfile
}

/**
 * @schema AdminShippingProfilesListRes
 * type: object
 * description: "The list of shipping profiles."
 * required:
 *   - shipping_profiles
 * properties:
 *   shipping_profiles:
 *     type: array
 *     description: An array of shipping profiles details.
 *     items:
 *       $ref: "#/components/schemas/ShippingProfile"
 */
export type AdminShippingProfilesListRes = {
  shipping_profiles: ShippingProfile[]
}

export * from "./create-shipping-profile"
export * from "./delete-shipping-profile"
export * from "./update-shipping-profile"
