import { ShippingOption } from "./../../../../"
import { Router } from "express"

const route = Router()

export default (app) => {
  app.use("/shipping-options", route)

  route.get("/", require("./list-options").default)
  route.get("/:cart_id", require("./list-shipping-options").default)

  return app
}

export type StoreShippingOptionsListRes = {
  shipping_options: ShippingOption[]
}

export * from "./list-options"
export * from "./list-shipping-options"
