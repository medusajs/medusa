import { ContainerRegistrationKeys, MedusaV2Flag } from "@medusajs/utils"
import { NextFunction, Request, RequestHandler, Response } from "express"

import passport from "passport"

export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const featureFlagRouter = req.scope.resolve(
      ContainerRegistrationKeys.FEATURE_FLAG_ROUTER
    )
    if (featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
      return next()
    }
    passport.authenticate(
      ["admin-session", "admin-bearer", "admin-api-token"],
      { session: false }
    )(req, res, next)
  }
}
