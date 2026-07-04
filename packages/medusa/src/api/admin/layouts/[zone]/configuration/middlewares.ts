import { validateAndTransformBody } from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { AdminSetLayoutConfiguration } from "./validators"

export const layoutConfigurationRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/admin/layouts/:zone/configuration",
    middlewares: [validateAndTransformBody(AdminSetLayoutConfiguration)],
  },
]
