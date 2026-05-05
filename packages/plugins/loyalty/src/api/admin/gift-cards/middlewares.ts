import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
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
      validateAndTransformBody(AdminUpdateGiftCard),
      validateAndTransformQuery(
        AdminGetGiftCardsParams,
        retrieveGiftCardTransformQueryConfig
      ),
    ],
  },
];
