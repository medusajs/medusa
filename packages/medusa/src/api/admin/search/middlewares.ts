import { validateAndTransformQuery } from "@medusajs/framework"
import {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
  MiddlewareRoute,
} from "@medusajs/framework/http"
import { Logger } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { AdminGetSearchParams } from "./validators"

// The Search Module is opt-in, so the route only exists when it is registered.
const isSearchEnabledMiddleware = (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  const searchService = req.scope.resolve(Modules.SEARCH, {
    allowUnregistered: true,
  })

  if (!searchService) {
    const logger =
      req.scope.resolve<Logger>(ContainerRegistrationKeys.LOGGER, {
        allowUnregistered: true,
      }) ?? (console as unknown as Logger)

    logger.warn(
      "Trying to access '/admin/search' but the Search Module is not configured"
    )

    return res.status(404).json({
      type: "not_found",
      message: "Search is not configured on this application",
    })
  }

  return next()
}

export const adminSearchRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/search",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      isSearchEnabledMiddleware,
      validateAndTransformQuery(AdminGetSearchParams, {
        isList: true,
        defaultLimit: 20,
      }),
    ],
  },
]
