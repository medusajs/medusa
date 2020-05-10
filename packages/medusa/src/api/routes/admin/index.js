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
import orderRoutes from "./orders"

const route = Router()

export default (app, container) => {
  const middlewareService = container.resolve("middlewareService")

  app.use("/admin", route)

  // Unauthenticated routes
  authRoutes(route)

  // Calls all middleware that has been registered to run before authentication.
  middlewareService.usePreAuthentication(app)

  // Authenticated routes
  route.use(middlewares.authenticate())

  // Calls all middleware that has been registered to run after authentication.
  middlewareService.usePostAuthentication(app)

  productRoutes(route)
  userRoutes(route)
  regionRoutes(route)
  shippingOptionRoutes(route)
  shippingProfileRoutes(route)
  discountRoutes(route)
  orderRoutes(route)
  // productVariantRoutes(route)

  return app
}
