import * as QueryConfig from "./query-config"

import {
  StoreCreateCustomer,
  StoreCreateCustomerAddress,
  StoreGetCustomerParams,
  StoreGetCustomerAddressesParams,
  StoreUpdateCustomer,
  StoreUpdateCustomerAddress,
  StoreGetCustomerAddressParams,
} from "./validators"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"

export const storeCustomerRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/store/customers",
    middlewares: [
      authenticate("store", ["session", "bearer"], { allowUnregistered: true }),
      validateAndTransformBody(StoreCreateCustomer),
      validateAndTransformQuery(
        StoreGetCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "ALL",
    matcher: "/store/customers/me*",
    middlewares: [authenticate("store", ["session", "bearer"])],
  },
  {
    method: ["GET"],
    matcher: "/store/customers/me",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/customers/me",
    middlewares: [
      validateAndTransformBody(StoreUpdateCustomer),
      validateAndTransformQuery(
        StoreGetCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/customers/me/addresses",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCustomerAddressesParams,
        QueryConfig.listAddressesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/customers/me/addresses",
    middlewares: [
      validateAndTransformBody(StoreCreateCustomerAddress),
      validateAndTransformQuery(
        StoreGetCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/customers/me/addresses/:address_id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCustomerAddressParams,
        QueryConfig.retrieveAddressTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/customers/me/addresses/:address_id",
    middlewares: [
      validateAndTransformBody(StoreUpdateCustomerAddress),
      validateAndTransformQuery(
        StoreGetCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/store/customers/me/addresses/:address_id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCustomerAddressParams,
        QueryConfig.retrieveAddressTransformQueryConfig
      ),
    ],
  },
]
