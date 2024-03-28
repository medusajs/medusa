import * as QueryConfig from "./query-config"

import { transformBody, transformQuery } from "../../../api/middlewares"
import {
  AdminGetApiKeysApiKeyParams,
  AdminGetApiKeysParams,
  AdminPostApiKeysApiKeyReq,
  AdminPostApiKeysApiKeySalesChannelsBatchReq,
  AdminPostApiKeysReq,
  AdminRevokeApiKeysApiKeyReq,
} from "./validators"

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
    middlewares: [
      transformQuery(
        AdminGetApiKeysApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
      transformBody(AdminPostApiKeysReq),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id",
    middlewares: [
      transformQuery(
        AdminGetApiKeysApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
      transformBody(AdminPostApiKeysApiKeyReq),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/api-keys/:id",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/revoke",
    middlewares: [
      transformQuery(
        AdminGetApiKeysApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
      transformBody(AdminRevokeApiKeysApiKeyReq),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/sales-channels/batch/add",
    middlewares: [
      transformQuery(
        AdminGetApiKeysApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
      transformBody(AdminPostApiKeysApiKeySalesChannelsBatchReq),
    ],
  },
]
