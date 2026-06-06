import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@zjedene-medusa/framework"
import { authenticate, MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { ensurePublishableKeyAndSalesChannelMatch } from "../../utils/middlewares/common/ensure-pub-key-sales-channel-match"
import { maybeAttachPublishableKeyScopes } from "../../utils/middlewares/common/maybe-attach-pub-key-scopes"
import * as OrderQueryConfig from "../orders/query-config"
import { StoreGetOrderParams } from "../orders/validators"
import * as QueryConfig from "./query-config"
import {
  StoreAddCartLineItem,
  StoreAddCartPromotions,
  StoreAddCartShippingMethods,
  StoreCalculateCartTaxes,
  StoreCreateCart,
  StoreGetCartsCart,
  StoreRemoveCartPromotions,
  StoreUpdateCart,
  StoreUpdateCartCustomer,
  StoreUpdateCartLineItem,
} from "./validators"

export const storeCartRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/carts/:id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCartsCart,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/carts",
    middlewares: [
      validateAndTransformBody(StoreCreateCart),
      validateAndTransformQuery(
        StoreGetCartsCart,
        QueryConfig.retrieveTransformQueryConfig
      ),
      maybeAttachPublishableKeyScopes,
      ensurePublishableKeyAndSalesChannelMatch,
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/carts/:id",
    middlewares: [
      validateAndTransformBody(StoreUpdateCart),
      validateAndTransformQuery(
        StoreGetCartsCart,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/carts/:id/customer",
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      validateAndTransformBody(StoreUpdateCartCustomer),
      validateAndTransformQuery(
        StoreGetCartsCart,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/carts/:id/line-items",
    middlewares: [
      validateAndTransformBody(StoreAddCartLineItem),
      validateAndTransformQuery(
        StoreGetCartsCart,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/carts/:id/line-items/:line_id",
    middlewares: [
      validateAndTransformBody(StoreUpdateCartLineItem),
      validateAndTransformQuery(
        StoreGetCartsCart,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/store/carts/:id/line-items/:line_id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCartsCart,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/carts/:id/promotions",
    middlewares: [
      validateAndTransformBody(StoreAddCartPromotions),
      validateAndTransformQuery(
        StoreGetCartsCart,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/carts/:id/taxes",
    middlewares: [
      validateAndTransformBody(StoreCalculateCartTaxes),
      validateAndTransformQuery(
        StoreGetCartsCart,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/carts/:id/shipping-methods",
    middlewares: [
      validateAndTransformBody(StoreAddCartShippingMethods),
      validateAndTransformQuery(
        StoreGetCartsCart,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/store/carts/:id/promotions",
    middlewares: [
      validateAndTransformBody(StoreRemoveCartPromotions),
      validateAndTransformQuery(
        StoreGetCartsCart,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/carts/:id/complete",
    middlewares: [
      validateAndTransformQuery(
        StoreGetOrderParams,
        OrderQueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
