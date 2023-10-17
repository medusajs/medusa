import { NextFunction, Request, Response } from "express"

import { FlagRouter } from "@medusajs/utils"

export function isFeatureFlagEnabled(
  flagKey: string,
  disabled = false
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    const featureFlagRouter = req.scope.resolve(
      "featureFlagRouter"
    ) as FlagRouter

    if (
      (featureFlagRouter.isFeatureEnabled(flagKey) && !disabled) ||
      (disabled && !featureFlagRouter.isFeatureEnabled(flagKey))
    ) {
      next()
    } else {
      res.sendStatus(404)
    }
  }
}
