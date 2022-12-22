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

export type AdminDeleteShippingProfileRes = DeleteResponse

export const defaultAdminShippingProfilesRelations: (keyof ShippingProfile)[] =
  ["products", "shipping_options"]

export type AdminShippingProfilesRes = {
  shipping_profile: ShippingProfile
}

export type AdminShippingProfilesListRes = {
  shipping_profiles: ShippingProfile[]
}

export * from "./create-shipping-profile"
export * from "./delete-shipping-profile"
export * from "./update-shipping-profile"
