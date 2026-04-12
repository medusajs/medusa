import {
  MiddlewareRoute,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { ensureViewConfigurationsEnabled } from "../views/[entity]/configurations/middleware"
import * as QueryConfig from "./query-config"
import {
  AdminBatchPropertyLabels,
  AdminCreatePropertyLabel,
  AdminPropertyLabelListParams,
  AdminPropertyLabelParams,
  AdminUpdatePropertyLabel,
} from "./validators"

export const adminPropertyLabelsMiddlewares: MiddlewareRoute[] = [
  // List property labels
  {
    matcher: "/admin/property-labels",
    method: "GET",
    middlewares: [
      ensureViewConfigurationsEnabled,
      validateAndTransformQuery(
        AdminPropertyLabelListParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  // Create property label
  {
    matcher: "/admin/property-labels",
    method: "POST",
    middlewares: [
      ensureViewConfigurationsEnabled,
      validateAndTransformBody(AdminCreatePropertyLabel),
      validateAndTransformQuery(
        AdminPropertyLabelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  // Get single property label
  {
    matcher: "/admin/property-labels/:id",
    method: "GET",
    middlewares: [
      ensureViewConfigurationsEnabled,
      validateAndTransformQuery(
        AdminPropertyLabelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  // Update property label
  {
    matcher: "/admin/property-labels/:id",
    method: "POST",
    middlewares: [
      ensureViewConfigurationsEnabled,
      validateAndTransformBody(AdminUpdatePropertyLabel),
      validateAndTransformQuery(
        AdminPropertyLabelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  // Delete property label
  {
    matcher: "/admin/property-labels/:id",
    method: "DELETE",
    middlewares: [ensureViewConfigurationsEnabled],
  },
  // Batch operations
  {
    matcher: "/admin/property-labels/batch",
    method: "POST",
    middlewares: [
      ensureViewConfigurationsEnabled,
      validateAndTransformBody(AdminBatchPropertyLabels),
      validateAndTransformQuery(
        AdminPropertyLabelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
