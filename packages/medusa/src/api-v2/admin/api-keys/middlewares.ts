import * as QueryConfig from "./query-config"

import {
  AdminGetApiKeysApiKeyParams,
  AdminGetApiKeysParams,
  AdminPostApiKeysApiKeyReq,
  AdminPostApiKeysReq,
  AdminRevokeApiKeysApiKeyReq,
} from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminApiKeyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/api-keys*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/api-keys",
    middlewares: [
      transformQuery(
        AdminGetApiKeysParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/api-keys/:id",
    middlewares: [
      transformQuery(
        AdminGetApiKeysApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys",
    middlewares: [transformBody(AdminPostApiKeysReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id",
    middlewares: [transformBody(AdminPostApiKeysApiKeyReq)],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/api-keys/:id",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/revoke",
    middlewares: [transformBody(AdminRevokeApiKeysApiKeyReq)],
  },
]
