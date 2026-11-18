import {
  authorize,
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
      authorize([
        {
          resource: Entities.property_label,
          operation: PolicyOperation.read,
        },
      ]),
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
      authorize([
        {
          resource: Entities.property_label,
          operation: PolicyOperation.create,
        },
      ]),
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
      authorize([
        {
          resource: Entities.property_label,
          operation: PolicyOperation.read,
        },
      ]),
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
      authorize([
        {
          resource: Entities.property_label,
          operation: PolicyOperation.update,
        },
      ]),
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
    middlewares: [
      authorize([
        {
          resource: Entities.property_label,
          operation: PolicyOperation.delete,
        },
      ]),
      ensureViewConfigurationsEnabled,
    ],
  },
  // Batch operations
  {
    matcher: "/admin/property-labels/batch",
    method: "POST",
    middlewares: [
      authorize([
        {
          resource: Entities.property_label,
          operation: [
            PolicyOperation.create,
            PolicyOperation.update,
            PolicyOperation.delete,
          ],
        },
      ]),
      ensureViewConfigurationsEnabled,
      validateAndTransformBody(AdminBatchPropertyLabels),
      validateAndTransformQuery(
        AdminPropertyLabelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
