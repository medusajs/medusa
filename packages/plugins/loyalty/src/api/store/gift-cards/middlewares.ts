import {
  authenticate,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@zjedene-medusa/framework";
import { MiddlewareRoute } from "@zjedene-medusa/medusa";
import { retrieveGiftCardTransformQueryConfig } from "./query-config";
import { StoreGetGiftCardParams, StoreRedeemGiftCard } from "./validators";

export const storeGiftCardsMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/gift-cards/:code",
    middlewares: [
      validateAndTransformQuery(
        StoreGetGiftCardParams,
        retrieveGiftCardTransformQueryConfig
      ),
    ],
  },
];
