import { Router } from "express"
import errorHandler from "./middlewares/error-handler"
import admin from "./routes/admin"
import store from "./routes/store"

// guaranteed to get dependencies
export default (container, config) => {
  const app = Router()

  admin(app, container, config)
  store(app, container, config)

  app.use(errorHandler())

  return app
}

// Admin
export * from "./routes/admin/collections"
export * from "./routes/admin/auth"
export * from "./routes/admin/customers"
export * from "./routes/admin/discounts"
export * from "./routes/admin/draft-orders"
export * from "./routes/admin/gift-cards"
export * from "./routes/admin/invites"
export * from "./routes/admin/notes"
export * from "./routes/admin/notifications"
export * from "./routes/admin/shipping-profiles"
export * from "./routes/admin/store"
export * from "./routes/admin/products"
export * from "./routes/admin/users"
export * from "./routes/admin/orders"
export * from "./routes/admin/variants"
export * from "./routes/admin/return-reasons"
export * from "./routes/admin/swaps"
export * from "./routes/admin/uploads"
export * from "./routes/admin/returns"
export * from "./routes/admin/tax-rates"
export * from "./routes/admin/shipping-options"
export * from "./routes/admin/regions"
export * from "./routes/admin/product-tags"
export * from "./routes/admin/product-types"

// Store
export * from "./routes/store/auth"
export * from "./routes/store/carts"
export * from "./routes/store/collections"
export * from "./routes/store/customers"
export * from "./routes/store/gift-cards"
export * from "./routes/store/orders"
export * from "./routes/store/products"
export * from "./routes/store/regions"
export * from "./routes/store/return-reasons"
export * from "./routes/store/returns"
export * from "./routes/store/shipping-options"
export * from "./routes/store/swaps"
export * from "./routes/store/variants"
