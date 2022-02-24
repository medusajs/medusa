import { Router } from "express"
import { ShippingOption } from "../../../.."
import { PaginatedResponse, DeleteResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/shipping-options", route)

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

export type AdminShippingOptionsListRes = PaginatedResponse & {
  shipping_options: ShippingOption[]
}

export type AdminShippingOptionsRes = {
  shipping_option: ShippingOption
}

export type AdminShippingOptionsDeleteRes = DeleteResponse

export * from "./create-shipping-option"
export * from "./delete-shipping-option"
export * from "./get-shipping-option"
export * from "./list-shipping-options"
export * from "./update-shipping-option"
