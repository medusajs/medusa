import { NextFunction, Request, Response } from "express"
import { FlagRouter } from "../../utils/flag-router"

export function isFeatureFlagEnabled(
  flagKey: string
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    const featureFlagRouter = req.scope.resolve(
      "featureFlagRouter"
    ) as FlagRouter

    if (!featureFlagRouter.isFeatureEnabled(flagKey)) {
      res.sendStatus(404)
    } else {
      next()
    }
  }
}
