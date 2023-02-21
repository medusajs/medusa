import { Router } from "express"
import "reflect-metadata"
import { Order } from "../../../.."
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { FindParams, PaginatedResponse } from "../../../../types/common"
import { FlagRouter } from "../../../../utils/flag-router"
import middlewares, {
  transformBody,
  transformIncludesOptions,
  transformQuery,
} from "../../../middlewares"
import { checkRegisteredModules } from "../../../middlewares/check-registered-modules"
import { AdminOrdersOrderLineItemReservationReq } from "./create-reservation-for-line-item"
import { AdminGetOrdersOrderReservationsParams } from "./get-reservations"
import { AdminGetOrdersParams } from "./list-orders"
import {
  AdminPostOrdersOrderSwapsParams,
  AdminPostOrdersOrderSwapsReq,
} from "./create-swap"
import {
  AdminPostOrdersOrderParams,
  AdminPostOrdersOrderReq,
} from "./update-order"
import { AdminPostOrdersOrderCompleteParams } from "./complete-order"
import {
  AdminPostOrdersOrderRefundsParams,
  AdminPostOrdersOrderRefundsReq,
} from "./refund-payment"
import { AdminPostOrdersOrderCaptureParams } from "./capture-payment"
import {
  AdminPostOrdersOrderFulfillmentsParams,
  AdminPostOrdersOrderFulfillmentsReq,
} from "./create-fulfillment"
import { AdminPostOrdersOrderFulfillementsCancelParams } from "./cancel-fulfillment"
import { AdminPostOrdersOrderSwapFulfillementsCancelParams } from "./cancel-fulfillment-swap"
import { AdminPostOrdersClaimFulfillmentsCancelParams } from "./cancel-fulfillment-claim"
import {
  AdminPostOrdersOrderShipmentParams,
  AdminPostOrdersOrderShipmentReq,
} from "./create-shipment"
import {
  AdminPostOrdersOrderReturnsParams,
  AdminPostOrdersOrderReturnsReq,
} from "./request-return"
import { AdminPostOrdersOrderCancel } from "./cancel-order"
import {
  AdminPostOrdersOrderShippingMethodsParams,
  AdminPostOrdersOrderShippingMethodsReq,
} from "./add-shipping-method"
import { AdminPostOrdersOrderArchiveParams } from "./archive-order"
import { AdminPostOrdersSwapCancelParams } from "./cancel-swap"
import { AdminPostOrdersOrderSwapsSwapFulfillmentsParams } from "./fulfill-swap"
import {
  AdminPostOrdersOrderSwapsSwapShipmentsParams,
  AdminPostOrdersOrderSwapsSwapShipmentsReq,
} from "./create-swap-shipment"
import { AdminPostOrdersOrderSwapsSwapProcessPaymentParams } from "./process-swap-payment"
import {
  AdminPostOrdersOrderClaimsParams,
  AdminPostOrdersOrderClaimsReq,
} from "./create-claim"
import { AdminPostOrdersClaimCancel } from "./cancel-claim"
import {
  AdminPostOrdersOrderClaimsClaimParams,
  AdminPostOrdersOrderClaimsClaimReq,
} from "./update-claim"
import {
  AdminPostOrdersOrderClaimsClaimFulfillmentsParams,
  AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
} from "./fulfill-claim"
import {
  AdminPostOrdersOrderClaimsClaimShipmentsParams,
  AdminPostOrdersOrderClaimsClaimShipmentsReq,
} from "./create-claim-shipment"

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  app.use("/orders", route)

  const relations = [...defaultAdminOrdersRelations]
  const defaultFields = [...defaultAdminOrdersFields]

  if (featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key)) {
    relations.push("sales_channel")
    defaultFields.push("sales_channel_id")
  }

  /**
   * List orders
   */
  route.get(
    "/",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformQuery(AdminGetOrdersParams, {
      defaultRelations: relations,
      defaultFields: defaultAdminOrdersFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-orders").default)
  )

  /**
   * Get an order
   */
  route.get(
    "/:id",
    transformIncludesOptions(allowedOrderIncludesFields, [
      AvailableOrderIncludesFields.RETURNABLE_ITEMS,
    ]),
    transformQuery(AdminPostOrdersOrderParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./get-order").default)
  )

  /**
   * Update an order
   */
  route.post(
    "/:id",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformBody(AdminPostOrdersOrderReq),
    transformQuery(FindParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./update-order").default)
  )

  /**
   * Mark an order as completed
   */
  route.post(
    "/:id/complete",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformQuery(AdminPostOrdersOrderCompleteParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./complete-order").default)
  )

  /**
   * Refund an amount to the customer's card.
   */
  route.post(
    "/:id/refund",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformBody(AdminPostOrdersOrderRefundsReq),
    transformQuery(AdminPostOrdersOrderRefundsParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./refund-payment").default)
  )

  /**
   * Capture the authorized amount on the customer's card.
   */
  route.post(
    "/:id/capture",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformQuery(AdminPostOrdersOrderCaptureParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./capture-payment").default)
  )

  /**
   * Create a fulfillment.
   */
  route.post(
    "/:id/fulfillment",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformBody(AdminPostOrdersOrderFulfillmentsReq),
    transformQuery(AdminPostOrdersOrderFulfillmentsParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./create-fulfillment").default)
  )

  /**
   * Cancel a fulfillment related to an order.
   */
  route.post(
    "/:id/fulfillments/:fulfillment_id/cancel",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformQuery(AdminPostOrdersOrderFulfillementsCancelParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./cancel-fulfillment").default)
  )

  /**
   * Cancel a fulfillment related to a swap.
   */
  route.post(
    "/:id/swaps/:swap_id/fulfillments/:fulfillment_id/cancel",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformQuery(AdminPostOrdersOrderSwapFulfillementsCancelParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./cancel-fulfillment-swap").default)
  )

  /**
   * Cancel a fulfillment related to a claim.
   */
  route.post(
    "/:id/claims/:claim_id/fulfillments/:fulfillment_id/cancel",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformQuery(AdminPostOrdersClaimFulfillmentsCancelParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./cancel-fulfillment-claim").default)
  )

  /**
   * Create a shipment.
   */
  route.post(
    "/:id/shipment",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformBody(AdminPostOrdersOrderShipmentReq),
    transformQuery(AdminPostOrdersOrderShipmentParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./create-shipment").default)
  )

  /**
   * Request a return.
   */
  route.post(
    "/:id/return",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformBody(AdminPostOrdersOrderReturnsReq),
    transformQuery(AdminPostOrdersOrderReturnsParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./request-return").default)
  )

  /**
   * Cancel an order.
   */
  route.post(
    "/:id/cancel",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformQuery(AdminPostOrdersOrderCancel, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./cancel-order").default)
  )

  /**
   * Add a shipping method
   */
  route.post(
    "/:id/shipping-methods",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformBody(AdminPostOrdersOrderShippingMethodsReq),
    transformQuery(AdminPostOrdersOrderShippingMethodsParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./add-shipping-method").default)
  )

  /**
   * Archive an order.
   */
  route.post(
    "/:id/archive",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformQuery(AdminPostOrdersOrderArchiveParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./archive-order").default)
  )

  /**
   * Creates a swap, requests a return and prepares a cart for payment.
   */
  route.post(
    "/:id/swaps",
    transformIncludesOptions(allowedOrderIncludesFields, [
      AvailableOrderIncludesFields.RETURNABLE_ITEMS,
    ]),
    transformBody(AdminPostOrdersOrderSwapsReq),
    transformQuery(AdminPostOrdersOrderSwapsParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./create-swap").default)
  )

  /**
   * Cancels a swap.
   */
  route.post(
    "/:id/swaps/:swap_id/cancel",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformQuery(AdminPostOrdersSwapCancelParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./cancel-swap").default)
  )

  /**
   * Fulfills a swap.
   */
  route.post(
    "/:id/swaps/:swap_id/fulfillments",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformQuery(AdminPostOrdersOrderSwapsSwapFulfillmentsParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./fulfill-swap").default)
  )

  /**
   * Marks a swap fulfillment as shipped.
   */
  route.post(
    "/:id/swaps/:swap_id/shipments",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformBody(AdminPostOrdersOrderSwapsSwapShipmentsReq),
    transformQuery(AdminPostOrdersOrderSwapsSwapShipmentsParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./create-swap-shipment").default)
  )

  /**
   * Captures the payment associated with a swap
   */
  route.post(
    "/:id/swaps/:swap_id/process-payment",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformQuery(AdminPostOrdersOrderSwapsSwapProcessPaymentParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./process-swap-payment").default)
  )

  /**
   * Creates a claim
   */
  route.post(
    "/:id/claims",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformBody(AdminPostOrdersOrderClaimsReq),
    transformQuery(AdminPostOrdersOrderClaimsParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./create-claim").default)
  )

  /**
   * Cancels a claim
   */
  route.post(
    "/:id/claims/:claim_id/cancel",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformQuery(AdminPostOrdersClaimCancel, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./cancel-claim").default)
  )

  /**
   * Updates a claim
   */
  route.post(
    "/:id/claims/:claim_id",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformBody(AdminPostOrdersOrderClaimsClaimReq),
    transformQuery(AdminPostOrdersOrderClaimsClaimParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./update-claim").default)
  )

  /**
   * Creates claim fulfillment
   */
  route.post(
    "/:id/claims/:claim_id/fulfillments",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformBody(AdminPostOrdersOrderClaimsClaimFulfillmentsReq),
    transformQuery(AdminPostOrdersOrderClaimsClaimFulfillmentsParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./fulfill-claim").default)
  )

  /**
   * Creates claim shipment
   */
  route.post(
    "/:id/claims/:claim_id/shipments",
    transformIncludesOptions(allowedOrderIncludesFields),
    transformBody(AdminPostOrdersOrderClaimsClaimShipmentsReq),
    transformQuery(AdminPostOrdersOrderClaimsClaimShipmentsParams, {
      defaultRelations: relations,
      defaultFields: defaultFields,
      isList: false,
    }),
    middlewares.wrap(require("./create-claim-shipment").default)
  )

  route.get(
    "/:id/reservations",
    checkRegisteredModules({
      inventoryService:
        "Inventory is not enabled. Please add an Inventory module to enable this functionality.",
    }),
    transformQuery(AdminGetOrdersOrderReservationsParams, {
      isList: true,
    }),
    middlewares.wrap(require("./get-reservations").default)
  )

  route.post(
    "/:id/line-items/:line_item_id/reserve",
    checkRegisteredModules({
      inventoryService:
        "Inventory is not enabled. Please add an Inventory module to enable this functionality.",
    }),
    transformBody(AdminOrdersOrderLineItemReservationReq),
    middlewares.wrap(require("./create-reservation-for-line-item").default)
  )

  return app
}

/**
 * @schema AdminOrdersRes
 * type: object
 * properties:
 *   order:
 *     $ref: "#/components/schemas/Order"
 */
export type AdminOrdersRes = {
  order: Order
}

/**
 * @schema AdminOrdersListRes
 * type: object
 * properties:
 *   orders:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Order"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of items skipped before these items
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminOrdersListRes = PaginatedResponse & {
  orders: Order[]
}

export const defaultAdminOrdersRelations = [
  "customer",
  "billing_address",
  "shipping_address",
  "discounts",
  "discounts.rule",
  "shipping_methods",
  "payments",
  "fulfillments",
  "fulfillments.tracking_links",
  "fulfillments.items",
  "returns",
  "returns.shipping_method",
  "returns.shipping_method.tax_lines",
  "returns.items",
  "returns.items.reason",
  "gift_cards",
  "gift_card_transactions",
  "claims",
  "claims.return_order",
  "claims.return_order.shipping_method",
  "claims.return_order.shipping_method.tax_lines",
  "claims.shipping_methods",
  "claims.shipping_address",
  "claims.additional_items",
  "claims.fulfillments",
  "claims.fulfillments.tracking_links",
  "claims.claim_items",
  "claims.claim_items.item",
  "claims.claim_items.images",
  // "claims.claim_items.tags",
  "swaps",
  "swaps.return_order",
  "swaps.return_order.shipping_method",
  "swaps.return_order.shipping_method.tax_lines",
  "swaps.payment",
  "swaps.shipping_methods",
  "swaps.shipping_methods.tax_lines",
  "swaps.shipping_address",
  "swaps.additional_items",
  "swaps.fulfillments",
  "swaps.fulfillments.tracking_links",
]

export const defaultAdminOrdersFields = [
  "id",
  "status",
  "fulfillment_status",
  "payment_status",
  "display_id",
  "cart_id",
  "draft_order_id",
  "customer_id",
  "email",
  "region_id",
  "currency_code",
  "tax_rate",
  "canceled_at",
  "created_at",
  "updated_at",
  "metadata",
  "items.refundable",
  "swaps.additional_items.refundable",
  "claims.additional_items.refundable",
  "no_notification",
] as (keyof Order)[]

export const filterableAdminOrdersFields = [
  "id",
  "status",
  "fulfillment_status",
  "payment_status",
  "display_id",
  "cart_id",
  "customer_id",
  "email",
  "region_id",
  "currency_code",
  "tax_rate",
  "canceled_at",
  "created_at",
  "updated_at",
]

export const AvailableOrderIncludesFields = {
  RETURNABLE_ITEMS: "returnable_items",
}

export const allowedOrderIncludesFields = [
  AvailableOrderIncludesFields.RETURNABLE_ITEMS,
]

export * from "./add-shipping-method"
export * from "./archive-order"
export * from "./cancel-claim"
export * from "./cancel-fulfillment"
export * from "./cancel-fulfillment-claim"
export * from "./cancel-fulfillment-swap"
export * from "./cancel-order"
export * from "./cancel-swap"
export * from "./capture-payment"
export * from "./complete-order"
export * from "./create-claim"
export * from "./create-claim-shipment"
export * from "./create-fulfillment"
export * from "./create-shipment"
export * from "./create-swap"
export * from "./create-swap-shipment"
export * from "./fulfill-claim"
export * from "./fulfill-swap"
export * from "./get-order"
export * from "./list-orders"
export * from "./process-swap-payment"
export * from "./refund-payment"
export * from "./request-return"
export * from "./update-claim"
export * from "./update-order"
