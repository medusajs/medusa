import * as QueryConfig from "./query-config"

import {
  AdminGetCollectionsCollectionParams,
  AdminGetCollectionsParams,
  AdminPostCollectionsCollectionReq,
  AdminPostCollectionsReq,
} from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminCollectionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/collections*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },

  {
    method: ["GET"],
    matcher: "/admin/collections",
    middlewares: [
      transformQuery(
        AdminGetCollectionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/collections/:id",
    middlewares: [
      transformQuery(
        AdminGetCollectionsCollectionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/collections",
    middlewares: [transformBody(AdminPostCollectionsReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/collections/:id",
    middlewares: [transformBody(AdminPostCollectionsCollectionReq)],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/collections/:id",
    middlewares: [],
  },
  // TODO: There were two batch methods, they need to be handled
]
