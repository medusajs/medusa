import { Router } from "express"
import middlewares from "../../middlewares"
import authRoutes from "./auth"
import productRoutes from "./products"
import productVariantRoutes from "./product-variants"
import regionRoutes from "./regions"
import shippingOptionRoutes from "./shipping-options"
import shippingProfileRoutes from "./shipping-profiles"

const route = Router()

export default app => {
  app.use("/admin", route)

  // Unauthenticated routes
  authRoutes(route)

  // Authenticated routes
  route.use(middlewares.authenticate())

  productRoutes(route)
  regionRoutes(route)
  shippingOptionRoutes(route)
  shippingProfileRoutes(route)
  // productVariantRoutes(route)

  return app
}
