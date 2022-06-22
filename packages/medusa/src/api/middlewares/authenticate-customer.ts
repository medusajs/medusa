import { Request, Response, NextFunction, RequestHandler } from "express"
import { StrategyResolverService } from "../../services"

export default (): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const strategyResolver = req.scope.resolve(
      "strategyResolverService"
    ) as StrategyResolverService

    const authStrategyType = (req.headers["X-medusa-auth-strategy"] ??
      "core-store-default-auth") as string

    const authStrategy = strategyResolver.resolveAuthByType(authStrategyType)
    await authStrategy.validate(req, res, next)
  }
}
