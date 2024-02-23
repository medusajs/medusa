import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import {
  AdminGetApiKeysParams,
  AdminGetApiKeysApiKeyParams,
  AdminPostApiKeysReq,
  AdminPostApiKeysApiKeyReq,
  AdminRevokeApiKeysApiKeyReq,
} from "./validators"

export const adminApiKeyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/api-keys*",
    // middlewares: [authenticate("admin", ["bearer", "session"])],
    // TODO: Apply authentication middleware correctly once https://github.com/medusajs/medusa/pull/6447 is merged.
    middlewares: [
      (req, res, next) => {
        req.auth_user = { id: "test" }
        next()
      },
    ],
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
