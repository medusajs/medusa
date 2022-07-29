import { Router } from "express"
import "reflect-metadata"
import { Cart, Order, Swap } from "../../../../"
import { DeleteResponse, EmptyQueryParams } from "../../../../types/common"
import { transformBody, transformQuery } from "../../../middlewares"
import { StorePostCartsCartReq } from "./update-cart"
import { StorePostCartReq } from "./create-cart"
const route = Router()

export default (app, container) => {
  const middlewareService = container.resolve("middlewareService")
  const featureFlagRouter = container.resolve("featureFlagRouter")

  app.use("/carts", route)

  if (featureFlagRouter.isFeatureEnabled("sales_channels")) {
    defaultStoreCartRelations.push("sales_channel")
  }

  // Inject plugin routes
  const routers = middlewareService.getRouters("store/carts")
  for (const router of routers) {
    route.use("/", router)
  }

  route.get(
    "/:id",
    transformQuery(EmptyQueryParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    require("./get-cart").default
  )

  route.post(
    "/",
    middlewareService.usePreCartCreation(),
    transformBody(StorePostCartReq),
    require("./create-cart").default
  )

  route.post(
    "/:id",
    transformBody(StorePostCartsCartReq),
    require("./update-cart").default
  )

  route.post("/:id/complete", require("./complete-cart").default)

  // DEPRECATION
  route.post("/:id/complete-cart", require("./complete-cart").default)

  // Line items
  route.post("/:id/line-items", require("./create-line-item").default)
  route.post("/:id/line-items/:line_id", require("./update-line-item").default)
  route.delete(
    "/:id/line-items/:line_id",
    require("./delete-line-item").default
  )

  route.delete("/:id/discounts/:code", require("./delete-discount").default)

  // Payment sessions
  route.post(
    "/:id/payment-sessions",
    require("./create-payment-sessions").default
  )

  route.post(
    "/:id/payment-sessions/:provider_id",
    require("./update-payment-session").default
  )

  route.delete(
    "/:id/payment-sessions/:provider_id",
    require("./delete-payment-session").default
  )

  route.post(
    "/:id/payment-sessions/:provider_id/refresh",
    require("./refresh-payment-session").default
  )

  route.post("/:id/payment-session", require("./set-payment-session").default)

  // Shipping Options
  route.post("/:id/shipping-methods", require("./add-shipping-method").default)

  // Taxes
  route.post("/:id/taxes", require("./calculate-taxes").default)

  return app
}

export const defaultStoreCartFields: (keyof Cart)[] = [
  "subtotal",
  "tax_total",
  "shipping_total",
  "discount_total",
  "gift_card_total",
  "total",
]

export const defaultStoreCartRelations = [
  "gift_cards",
  "region",
  "items",
  "items.adjustments",
  "payment",
  "shipping_address",
  "billing_address",
  "region.countries",
  "region.payment_providers",
  "shipping_methods",
  "payment_sessions",
  "shipping_methods.shipping_option",
  "discounts",
  "discounts.rule",
]

export type StoreCartsRes = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

export type StoreCompleteCartRes =
  | {
      type: "cart"
      data: Cart
    }
  | {
      type: "order"
      data: Order
    }
  | {
      type: "swap"
      data: Swap
    }

export type StoreCartsDeleteRes = DeleteResponse

export * from "./add-shipping-method"
export * from "./create-cart"
export * from "./create-line-item"
export * from "./create-payment-sessions"
export * from "./set-payment-session"
export * from "./update-cart"
export * from "./update-line-item"
export * from "./update-payment-session"
