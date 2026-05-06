import {
  authenticate,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { MiddlewareRoute } from "@medusajs/medusa";
import {
  listStoreCreditAccountsTransformQueryConfig,
  retrieveStoreCreditAccountTransformQueryConfig,
} from "./query-config";
import {
  StoreClaimStoreCreditAccountParams,
  StoreGetStoreCreditAccountParams,
  StoreGetStoreCreditAccountsParams,
} from "./validators";

export const storeStoreCreditAccountMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/store/store-credit-accounts*",
    middlewares: [authenticate("customer", ["session", "bearer"])],
  },
  {
    method: ["GET"],
    matcher: "/store/store-credit-accounts",
    middlewares: [
      validateAndTransformQuery(
        StoreGetStoreCreditAccountsParams,
        listStoreCreditAccountsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/store-credit-accounts/:id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetStoreCreditAccountParams,
        retrieveStoreCreditAccountTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/store-credit-accounts/claim",
    middlewares: [
      validateAndTransformBody(StoreClaimStoreCreditAccountParams),
      validateAndTransformQuery(
        StoreGetStoreCreditAccountParams,
        retrieveStoreCreditAccountTransformQueryConfig
      ),
    ],
  },
];
