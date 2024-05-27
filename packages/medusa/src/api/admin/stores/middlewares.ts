import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  AdminGetStoreParams,
  AdminGetStoresParams,
  AdminUpdateStore,
} from "./validators"

export const adminStoreRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/stores",
    middlewares: [
      validateAndTransformQuery(
        AdminGetStoresParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/stores/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetStoreParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stores/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateStore),
      validateAndTransformQuery(
        AdminGetStoreParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
