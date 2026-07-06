import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { MiddlewareRoute } from "@medusajs/medusa";
import {
  listStoreCreditAccountsTransformQueryConfig,
  listStoreCreditAccountTransactionsTransformQueryConfig,
  retrieveStoreCreditAccountTransformQueryConfig,
} from "./query-config";
import {
  AdminCreateStoreCreditAccount,
  AdminCreditStoreCreditAccountParams,
  AdminGetStoreCreditAccountsParams,
  AdminGetStoreCreditAccountTransactionsParams,
} from "./validators";

export const adminStoreCreditAccountMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/store-credit-accounts",
    middlewares: [
      validateAndTransformQuery(
        AdminGetStoreCreditAccountsParams,
        listStoreCreditAccountsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/store-credit-accounts/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetStoreCreditAccountsParams,
        retrieveStoreCreditAccountTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/store-credit-accounts/:id/transactions",
    middlewares: [
      validateAndTransformQuery(
        AdminGetStoreCreditAccountTransactionsParams,
        listStoreCreditAccountTransactionsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/store-credit-accounts/:id/credit",
    middlewares: [
      validateAndTransformBody(AdminCreditStoreCreditAccountParams),
      validateAndTransformQuery(
        AdminGetStoreCreditAccountsParams,
        retrieveStoreCreditAccountTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/store-credit-accounts",
    middlewares: [
      validateAndTransformBody(AdminCreateStoreCreditAccount),
      validateAndTransformQuery(
        AdminGetStoreCreditAccountsParams,
        retrieveStoreCreditAccountTransformQueryConfig
      ),
    ],
  },
];
