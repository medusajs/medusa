import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { StorePostCustomersReq, StoreGetCustomersMeParams } from "./validators"
import authenticate from "../../../utils/authenticate-middleware"
import * as QueryConfig from "./query-config"

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
