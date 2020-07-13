import { Router } from "express"
import cors from "cors"

import middlewares from "../../middlewares"

import authRoutes from "./auth"
import productRoutes from "./products"
import cartRoutes from "./carts"
import orderRoutes from "./orders"
import customerRoutes from "./customers"
import shippingOptionRoutes from "./shipping-options"
import regionRoutes from "./regions"

const route = Router()

export default (app, container, config) => {
  app.use("/store", route)

  const storeCors = config.store_cors || ""
  route.use(
    cors({
      origin: storeCors.split(","),
      credentials: true,
    })
  )

  route.use(middlewares.authenticateCustomer())

  authRoutes(route)
  customerRoutes(route)
  productRoutes(route)
  orderRoutes(route)
  cartRoutes(route)
  shippingOptionRoutes(route)
  regionRoutes(route)

  return app
}
