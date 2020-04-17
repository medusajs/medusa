import { Router } from "express"
import productRoutes from "./products"
import cartRoutes from "./carts"
import shippingOptionRoutes from "./shipping-options"

const route = Router()

export default app => {
  app.use("/store", route)

  productRoutes(route)
  cartRoutes(route)
  shippingOptionRoutes(route)

  return app
}
