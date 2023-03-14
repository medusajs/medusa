import "reflect-metadata"
import { RequestHandler, Router } from "express"

import { Cart, Order, Swap } from "../../../../"
import { DeleteResponse, FindParams } from "../../../../types/common"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { StorePostCartsCartReq } from "./update-cart"
import { StorePostCartReq } from "./create-cart"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import PublishableAPIKeysFeatureFlag from "../../../../loaders/feature-flags/publishable-api-keys"
import { extendRequestParams } from "../../../middlewares/publishable-api-key/extend-request-params"
import { validateSalesChannelParam } from "../../../middlewares/publishable-api-key/validate-sales-channel-param"

const route = Router()

export default (app, container) => {
  const middlewareService = container.resolve("middlewareService")
  const featureFlagRouter = container.resolve("featureFlagRouter")

  app.use("/carts", route)

  if (featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key)) {
    defaultStoreCartRelations.push("sales_channel")
  }

  // Inject plugin routes
  const routers = middlewareService.getRouters("store/carts")
  for (const router of routers) {
    route.use("/", router)
  }

  route.get(
    "/:id",
    transformQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    middlewares.wrap(require("./get-cart").default)
  )

  const createMiddlewares = [
    middlewareService.usePreCartCreation(),
    transformBody(StorePostCartReq),
  ]

  if (featureFlagRouter.isFeatureEnabled(PublishableAPIKeysFeatureFlag.key)) {
    createMiddlewares.push(
      extendRequestParams as unknown as RequestHandler,
      validateSalesChannelParam as unknown as RequestHandler
    )
  }

  route.post(
    "/",
    ...createMiddlewares,
    middlewares.wrap(require("./create-cart").default)
  )

  route.post(
    "/:id",
    transformBody(StorePostCartsCartReq),
    middlewares.wrap(require("./update-cart").default)
  )

  route.post(
    "/:id/complete",
    middlewares.wrap(require("./complete-cart").default)
  )

  // DEPRECATION
  route.post(
    "/:id/complete-cart",
    middlewares.wrap(require("./complete-cart").default)
  )

  // Line items
  route.post(
    "/:id/line-items",
    middlewares.wrap(require("./create-line-item").default)
  )
  route.post(
    "/:id/line-items/:line_id",
    middlewares.wrap(require("./update-line-item").default)
  )
  route.delete(
    "/:id/line-items/:line_id",
    middlewares.wrap(require("./delete-line-item").default)
  )

  route.delete(
    "/:id/discounts/:code",
    middlewares.wrap(require("./delete-discount").default)
  )

  // Payment sessions
  route.post(
    "/:id/payment-sessions",
    middlewares.wrap(require("./create-payment-sessions").default)
  )

  route.post(
    "/:id/payment-sessions/:provider_id",
    middlewares.wrap(require("./update-payment-session").default)
  )

  route.delete(
    "/:id/payment-sessions/:provider_id",
    middlewares.wrap(require("./delete-payment-session").default)
  )

  route.post(
    "/:id/payment-sessions/:provider_id/refresh",
    middlewares.wrap(require("./refresh-payment-session").default)
  )

  route.post(
    "/:id/payment-session",
    middlewares.wrap(require("./set-payment-session").default)
  )

  // Shipping Options
  route.post(
    "/:id/shipping-methods",
    middlewares.wrap(require("./add-shipping-method").default)
  )

  // Taxes
  route.post(
    "/:id/taxes",
    middlewares.wrap(require("./calculate-taxes").default)
  )

  return app
}

export const defaultStoreCartFields: (keyof Cart)[] = []

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

/**
 * @schema StoreCartsRes
 * type: object
 * properties:
 *   cart:
 *     $ref: "#/components/schemas/Cart"
 */
export type StoreCartsRes = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

/**
 * @schema StoreCompleteCartRes
 * type: object
 * properties:
 *   type:
 *     type: string
 *     description: The type of the data property.
 *     enum: [order, cart, swap]
 *   data:
 *     type: object
 *     description: The data of the result object. Its type depends on the type field.
 *     oneOf:
 *       - type: object
 *         allOf:
 *           - description: Cart was successfully authorized and order was placed successfully.
 *           - $ref: "#/components/schemas/Order"
 *       - type: object
 *         allOf:
 *           - description: Cart was successfully authorized but requires further actions.
 *           - $ref: "#/components/schemas/Cart"
 *       - type: object
 *         allOf:
 *           - description: When cart is used for a swap and it has been completed successfully.
 *           - $ref: "#/components/schemas/Swap"
 */
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
