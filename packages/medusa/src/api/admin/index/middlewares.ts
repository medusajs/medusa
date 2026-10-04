import { validateAndTransformBody } from "@medusajs/framework"
import {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
  MiddlewareRoute,
} from "@medusajs/framework/http"
import { Logger } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  FeatureFlag,
  Modules,
} from "@medusajs/framework/utils"
import IndexEngineFeatureFlag from "../../../feature-flags/index-engine"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { AdminIndexSyncPayload } from "./validator"

export const isIndexEnabledMiddleware = (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  const indexService = req.scope.resolve(Modules.INDEX, {
    allowUnregistered: true,
  })
  const logger =
    req.scope.resolve(ContainerRegistrationKeys.LOGGER, {
      allowUnregistered: true,
    }) ?? (console as unknown as Logger)

  if (
    !indexService ||
    !FeatureFlag.isFeatureEnabled(IndexEngineFeatureFlag.key)
  ) {
    logger.warn(
      "Trying to access '/admin/index/*' route but the index module is not configured"
    )
    /*
     * The response has to be ended here: setting the status alone leaves the
     * connection open with no body, so the client waits until it times out
     * instead of receiving the 404.
     */
    res.status(404).json({
      type: "not_found",
      message: "Route not found",
    })
    return
  }

  return next()
}

export const adminIndexRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/index/details",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      isIndexEnabledMiddleware,
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/index/sync",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      isIndexEnabledMiddleware,
      validateAndTransformBody(AdminIndexSyncPayload),
    ],
  },
]
