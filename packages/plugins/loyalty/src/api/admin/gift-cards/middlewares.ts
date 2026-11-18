import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { authorize } from "@medusajs/framework/http";
import { PolicyOperation } from "@medusajs/framework/utils";
import { MiddlewareRoute } from "@medusajs/medusa";
import {
  listGiftCardsTransformQueryConfig,
  retrieveGiftCardOrdersTransformQueryConfig,
  retrieveGiftCardTransformQueryConfig,
} from "./query-config";
import {
  AdminCreateGiftCard,
  AdminGetGiftCardsParams,
  AdminUpdateGiftCard,
} from "./validators";

export const adminGiftCardMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/gift-cards",
    middlewares: [
      authorize([
        {
          resource: "gift_card",
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetGiftCardsParams,
        listGiftCardsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/gift-cards/:id",
    middlewares: [
      authorize([
        {
          resource: "gift_card",
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetGiftCardsParams,
        retrieveGiftCardTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/gift-cards/:id/orders",
    middlewares: [
      authorize([
        {
          resource: "gift_card",
          operation: PolicyOperation.read,
        },
        {
          resource: "order",
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetGiftCardsParams,
        retrieveGiftCardOrdersTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/gift-cards",
    middlewares: [
      authorize([
        {
          resource: "gift_card",
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateGiftCard),
      validateAndTransformQuery(
        AdminGetGiftCardsParams,
        retrieveGiftCardTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/gift-cards/:id",
    middlewares: [
      authorize([
        {
          resource: "gift_card",
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateGiftCard),
      validateAndTransformQuery(
        AdminGetGiftCardsParams,
        retrieveGiftCardTransformQueryConfig
      ),
    ],
  },
];
