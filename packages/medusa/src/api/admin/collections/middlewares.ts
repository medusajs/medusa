import * as QueryConfig from "./query-config"
import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import {
  AdminCreateCollection,
  AdminGetCollectionParams,
  AdminGetCollectionsParams,
  AdminUpdateCollection,
} from "./validators"
import { createLinkBody } from "../../utils/validators"

export const adminCollectionRoutesMiddlewares: MiddlewareRoute[] = [
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
