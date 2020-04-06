import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
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

  // Product management
  route.post(
    "/:profile_id/products",
    middlewares.wrap(require("./add-product").default)
  )
  route.delete(
    "/:profile_id/products/:product_id",
    middlewares.wrap(require("./remove-product").default)
  )

  // Shipping Option management
  route.post(
    "/:profile_id/shipping-options",
    middlewares.wrap(require("./add-shipping-option").default)
  )
  route.delete(
    "/:profile_id/shipping-options/:option_id",
    middlewares.wrap(require("./remove-shipping-option").default)
  )

  return app
}
