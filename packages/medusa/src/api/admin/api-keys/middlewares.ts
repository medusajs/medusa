import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { createLinkBody } from "../../utils/validators"
import {
  AdminCreateApiKey,
  AdminGetApiKeyParams,
  AdminGetApiKeysParams,
  AdminRevokeApiKey,
  AdminUpdateApiKey,
} from "./validators"

export const adminApiKeyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/api-keys/*",
    policies: [
      {
        resource: Entities.api_key,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/api-keys",
    middlewares: [
      validateAndTransformQuery(
        AdminGetApiKeysParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.api_key,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/api-keys/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys",
    middlewares: [
      validateAndTransformBody(AdminCreateApiKey),
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.api_key,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateApiKey),
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.api_key,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/api-keys/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.api_key,
        operation: PolicyOperation.delete,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/revoke",
    middlewares: [
      validateAndTransformBody(AdminRevokeApiKey),
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.api_key,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/sales-channels",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.api_key,
        operation: PolicyOperation.update,
      },
    ],
  },
]
