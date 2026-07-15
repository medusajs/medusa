import {
  MiddlewareRoute,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { ensureViewConfigurationsEnabled } from "../views/[entity]/configurations/middleware"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
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
    policies: [
      {
        resource: Entities.property_label,
        operation: PolicyOperation.read,
      },
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
    policies: [
      {
        resource: Entities.property_label,
        operation: PolicyOperation.create,
      },
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
    policies: [
      {
        resource: Entities.property_label,
        operation: PolicyOperation.read,
      },
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
    policies: [
      {
        resource: Entities.property_label,
        operation: PolicyOperation.update,
      },
    ],
  },
  // Delete property label
  {
    matcher: "/admin/property-labels/:id",
    method: "DELETE",
    middlewares: [ensureViewConfigurationsEnabled],
    policies: [
      {
        resource: Entities.property_label,
        operation: PolicyOperation.delete,
      },
    ],
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
    policies: [
      {
        resource: Entities.property_label,
        operation: [
          PolicyOperation.create,
          PolicyOperation.update,
          PolicyOperation.delete,
        ],
      },
    ],
  },
]
