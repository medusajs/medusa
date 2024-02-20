import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import {
  StoreGetCustomersMeAddressesParams,
  StoreGetCustomersMeParams,
  StorePostCustomersMeAddressesAddressReq,
  StorePostCustomersMeAddressesReq,
  StorePostCustomersReq,
} from "./validators"

import { authenticate } from "../../../utils/authenticate-middleware"

export const storeCustomerRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/store/customers*",
    middlewares: [
      authenticate("store", ["session", "bearer"], { allowUnregistered: true }),
    ],
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
  {
    method: ["POST"],
    matcher: "/store/customers/me/addresses",
    middlewares: [transformBody(StorePostCustomersMeAddressesReq)],
  },
  {
    method: ["POST"],
    matcher: "/store/customers/me/addresses/:address_id",
    middlewares: [transformBody(StorePostCustomersMeAddressesAddressReq)],
  },
  {
    method: ["GET"],
    matcher: "/store/customers/me/addresses",
    middlewares: [
      transformQuery(
        StoreGetCustomersMeAddressesParams,
        QueryConfig.listAddressesTransformQueryConfig
      ),
    ],
  },
]
