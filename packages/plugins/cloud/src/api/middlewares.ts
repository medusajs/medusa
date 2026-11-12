import { defineMiddlewares } from "@medusajs/framework"
import { validateAndTransformBody } from "@medusajs/framework/http"
import { AdminUpdateCloudAnnouncementPreferences } from "./admin/cloud/announcement-preferences/validators"

export default defineMiddlewares({
  routes: [
    {
      method: ["POST"],
      matcher: "/admin/cloud/announcement-preferences",
      middlewares: [
        validateAndTransformBody(AdminUpdateCloudAnnouncementPreferences),
      ],
    },
  ],
})
