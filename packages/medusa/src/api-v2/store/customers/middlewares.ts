import * as QueryConfig from "./query-config"

import { StoreGetCustomersMeParams, StorePostCustomersReq } from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const storeCustomerRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/store/customers*",
    middlewares: [authenticate("store", ["session", "bearer"])],
  },
  {
    method: ["POST"],
    matcher: "/store/customers",
    middlewares: [transformBody(StorePostCustomersReq)],
  },
  {
    method: ["GET"],
    matcher: "/store/customers/me",
    middlewares: [
      transformQuery(
        StoreGetCustomersMeParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
