import { validateAndTransformBody } from "@zjedene-medusa/framework"
import {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
  MiddlewareRoute,
} from "@zjedene-medusa/framework/http"
import { Logger } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  FeatureFlag,
  Modules,
} from "@zjedene-medusa/framework/utils"
import IndexEngineFeatureFlag from "../../../feature-flags/index-engine"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { AdminIndexSyncPayload } from "./validator"

const isIndexEnabledMiddleware = (
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
    return res.status(404)
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
