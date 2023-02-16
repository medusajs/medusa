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
export * from "./routes/admin/analytics-configs"
export * from "./routes/admin/auth"
export * from "./routes/admin/batch"
export * from "./routes/admin/collections"
export * from "./routes/admin/currencies"
export * from "./routes/admin/customer-groups"
export * from "./routes/admin/customers"
export * from "./routes/admin/discounts"
export * from "./routes/admin/draft-orders"
export * from "./routes/admin/gift-cards"
export * from "./routes/admin/inventory-items"
export * from "./routes/admin/invites"
export * from "./routes/admin/notes"
export * from "./routes/admin/notifications"
export * from "./routes/admin/order-edits"
export * from "./routes/admin/orders"
export * from "./routes/admin/payment-collections"
export * from "./routes/admin/payments"
export * from "./routes/admin/price-lists"
export * from "./routes/admin/product-categories"
export * from "./routes/admin/product-tags"
export * from "./routes/admin/product-types"
export * from "./routes/admin/products"
export * from "./routes/admin/publishable-api-keys"
export * from "./routes/admin/regions"
export * from "./routes/admin/return-reasons"
export * from "./routes/admin/returns"
export * from "./routes/admin/reservations"
export * from "./routes/admin/sales-channels"
export * from "./routes/admin/shipping-options"
export * from "./routes/admin/shipping-profiles"
export * from "./routes/admin/stock-locations"
export * from "./routes/admin/store"
export * from "./routes/admin/swaps"
export * from "./routes/admin/tax-rates"
export * from "./routes/admin/uploads"
export * from "./routes/admin/users"
export * from "./routes/admin/variants"
// Store
export * from "./routes/store/auth"
export * from "./routes/store/carts"
export * from "./routes/store/collections"
export * from "./routes/store/customers"
export * from "./routes/store/gift-cards"
export * from "./routes/store/order-edits"
export * from "./routes/store/orders"
export * from "./routes/store/payment-collections"
export * from "./routes/store/product-categories"
export * from "./routes/store/product-tags"
export * from "./routes/store/product-types"
export * from "./routes/store/products"
export * from "./routes/store/regions"
export * from "./routes/store/return-reasons"
export * from "./routes/store/returns"
export * from "./routes/store/shipping-options"
export * from "./routes/store/swaps"
export * from "./routes/store/variants"
