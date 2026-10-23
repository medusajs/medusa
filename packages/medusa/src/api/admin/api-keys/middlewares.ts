import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
    middlewares: [
      authorize([
        {
          resource: Entities.api_key,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/api-keys",
    middlewares: [
      authorize([
        {
          resource: Entities.api_key,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetApiKeysParams,
        QueryConfig.listTransformQueryConfig
      ),
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
      authorize([
        {
          resource: Entities.api_key,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateApiKey),
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.api_key,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateApiKey),
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/api-keys/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.api_key,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/revoke",
    middlewares: [
      authorize([
        {
          resource: Entities.api_key,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminRevokeApiKey),
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/sales-channels",
    middlewares: [
      authorize([
        {
          resource: Entities.api_key,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.sales_channel,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetApiKeyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
