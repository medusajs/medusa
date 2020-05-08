import { Router } from "express"

import productRoutes from "./products"
import cartRoutes from "./carts"
import orderRoutes from "./orders"
import customerRoutes from "./customers"
import shippingOptionRoutes from "./shipping-options"

const route = Router()

export default app => {
  app.use("/store", route)

  customerRoutes(route)
  productRoutes(route)
  orderRoutes(route)
  cartRoutes(route)
  shippingOptionRoutes(route)

  return app
}
