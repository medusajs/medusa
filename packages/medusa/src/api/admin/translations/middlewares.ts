import {
  MiddlewareRoute,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT } from "../../../utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminBatchTranslations,
  AdminBatchTranslationSettings,
  AdminGetTranslationsParams,
  AdminTranslationEntitiesParams,
  AdminTranslationSettingsParams,
  AdminTranslationStatistics,
} from "./validators"

export const adminTranslationsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/translations/*",
    policies: [
      {
        resource: Entities.translation,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/translations",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTranslationsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.translation,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/translations/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [validateAndTransformBody(AdminBatchTranslations)],
    policies: [
      {
        resource: Entities.translation,
        operation: PolicyOperation.create,
      },
      {
        resource: Entities.translation,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/translations/statistics",
    middlewares: [validateAndTransformQuery(AdminTranslationStatistics, {})],
  },
  {
    method: ["GET"],
    matcher: "/admin/translations/settings",
    middlewares: [
      validateAndTransformQuery(AdminTranslationSettingsParams, {}),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/translations/settings/batch",
    middlewares: [validateAndTransformBody(AdminBatchTranslationSettings)],
    policies: [
      {
        resource: Entities.translation_setting,
        operation: PolicyOperation.create,
      },
      {
        resource: Entities.translation_setting,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/translations/entities",
    middlewares: [
      validateAndTransformQuery(
        AdminTranslationEntitiesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
]
