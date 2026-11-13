import { defineMiddlewares } from "@medusajs/framework"
import {
  authorize,
  MiddlewareRoute,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { CLOUD_POLICY_RESOURCE } from "../types/rbac"
import { AdminUpdateCloudAnnouncementPreferences } from "./admin/cloud/announcement-preferences/validators"

const routes: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/cloud/announcements",
    middlewares: [
      authorize([
        { resource: CLOUD_POLICY_RESOURCE, operation: PolicyOperation.read },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/cloud/announcement-preferences",
    middlewares: [
      authorize([
        { resource: CLOUD_POLICY_RESOURCE, operation: PolicyOperation.read },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/cloud/announcement-preferences",
    middlewares: [
      authorize([
        {
          resource: CLOUD_POLICY_RESOURCE,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateCloudAnnouncementPreferences),
    ],
  },
]

export default defineMiddlewares({ routes })
