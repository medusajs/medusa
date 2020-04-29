import { Router } from "express"
import middlewares from "../../middlewares"
import authRoutes from "./auth"
import productRoutes from "./products"
import userRoutes from "./users"
import productVariantRoutes from "./product-variants"
import regionRoutes from "./regions"
import shippingOptionRoutes from "./shipping-options"
import shippingProfileRoutes from "./shipping-profiles"
import discountRoutes from "./discounts"

const route = Router()

export default (app, container) => {
  const middlewareService = container.resolve("middlewareService")

  app.use("/admin", route)

  // Unauthenticated routes
  authRoutes(route)

  middlewareService.usePreAuthentication(app)

  // Authenticated routes
  route.use(middlewares.authenticate())

  middlewareService.usePostAuthentication(app)

  productRoutes(route)
  userRoutes(route)
  regionRoutes(route)
  shippingOptionRoutes(route)
  shippingProfileRoutes(route)
  discountRoutes(route)
  // productVariantRoutes(route)

  return app
}
