import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { createLinkBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateCollection,
  AdminGetCollectionParams,
  AdminGetCollectionsParams,
  AdminUpdateCollection,
} from "./validators"

export const adminCollectionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/collections/*",
    policies: [
      {
        resource: Entities.product_collection,
        operation: PolicyOperation.read,
      },
    ],
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
    policies: [
      {
        resource: Entities.product_collection,
        operation: PolicyOperation.read,
      },
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
    policies: [
      {
        resource: Entities.product_collection,
        operation: PolicyOperation.create,
      },
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
    policies: [
      {
        resource: Entities.product_collection,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/collections/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.product_collection,
        operation: PolicyOperation.delete,
      },
    ],
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
    policies: [
      {
        resource: Entities.product_collection,
        operation: PolicyOperation.update,
      },
    ],
  },
]
