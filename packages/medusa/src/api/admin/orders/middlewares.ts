import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminAuthorizeOrderPaymentSession,
  AdminCompleteOrder,
  AdminCreateOrderCreditLines,
  AdminGetOrderShippingOptionList,
  AdminGetOrdersOrderItemsParams,
  AdminGetOrdersOrderParams,
  AdminGetOrdersParams,
  AdminMarkOrderFulfillmentAsDelivered,
  AdminOrderCancelFulfillment,
  AdminOrderChangesParams,
  AdminOrderCreateFulfillment,
  AdminOrderCreateShipment,
  AdminTransferOrder,
  AdminTransferOrderToGuest,
  AdminUpdateOrder,
} from "./validators"

export const adminOrderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/orders/*",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/orders",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/export",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetOrdersParams,
        QueryConfig.exportTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/orders/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateOrder),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/orders/:id/line-items",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderItemsParams,
        QueryConfig.listOrderItemsQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/orders/:id/shipping-options",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrderShippingOptionList,
        QueryConfig.listShippingOptionsQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/orders/:id/changes",
    middlewares: [
      validateAndTransformQuery(
        AdminOrderChangesParams,
        QueryConfig.retrieveOrderChangesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/orders/:id/preview",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/archive",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/cancel",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      // validateAndTransformBody(),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/complete",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminCompleteOrder),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/payment-sessions/authorize",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminAuthorizeOrderPaymentSession),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/credit-lines",
    middlewares: [
      authorize([
        {
          resource: Entities.order_credit_line,
          operation: PolicyOperation.create,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminCreateOrderCreditLines),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/fulfillments",
    middlewares: [
      authorize([
        {
          resource: Entities.fulfillment,
          operation: PolicyOperation.create,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminOrderCreateFulfillment),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/fulfillments/:fulfillment_id/cancel",
    middlewares: [
      authorize([
        {
          resource: Entities.fulfillment,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminOrderCancelFulfillment),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/fulfillments/:fulfillment_id/shipments",
    middlewares: [
      authorize([
        {
          resource: Entities.fulfillment,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminOrderCreateShipment),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/fulfillments/:fulfillment_id/mark-as-delivered",
    middlewares: [
      authorize([
        {
          resource: Entities.fulfillment,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
      validateAndTransformBody(AdminMarkOrderFulfillmentAsDelivered),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/transfer",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminTransferOrder),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/transfer/guest",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminTransferOrderToGuest),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/transfer/cancel",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
