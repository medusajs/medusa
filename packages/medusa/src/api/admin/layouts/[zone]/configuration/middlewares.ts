import { validateAndTransformBody } from "@medusajs/framework"
import { authorizeIfNecessary, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import {
  AdminSetLayoutConfiguration,
  AdminSetLayoutConfigurationType,
} from "./validators"

export const layoutConfigurationRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/admin/layouts/:zone/configuration",
    middlewares: [
      validateAndTransformBody(AdminSetLayoutConfiguration),
      // The default layout applies to every user.
      authorizeIfNecessary<AdminSetLayoutConfigurationType>(
        (req) => !!req.validatedBody.is_default,
        {
          resource: "layout_configuration",
          operation: PolicyOperation.update,
        }
      ),
    ],
  },
]
