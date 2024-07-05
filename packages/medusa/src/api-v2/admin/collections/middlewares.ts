import * as QueryConfig from "./query-config"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import { validateAndTransformQuery } from "../../utils/validate-query"
import {
  AdminCreateCollection,
  AdminGetCollectionParams,
  AdminGetCollectionsParams,
  AdminUpdateCollection,
} from "./validators"
import { validateAndTransformBody } from "../../utils/validate-body"
import { createLinkBody } from "../../utils/validators"

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
      validateAndTransformQuery(
        AdminGetCollectionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/collections/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetCollectionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/collections",
    middlewares: [
      validateAndTransformBody(AdminCreateCollection),
      validateAndTransformQuery(
        AdminGetCollectionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/collections/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateCollection),
      validateAndTransformQuery(
        AdminGetCollectionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/collections/:id",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/admin/collections/:id/products",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetCollectionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
