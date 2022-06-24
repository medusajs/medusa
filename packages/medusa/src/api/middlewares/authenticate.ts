import { Request, Response, NextFunction, RequestHandler } from "express"
import { AuthService } from "../../services"

export default (): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authService = req.scope.resolve("authService") as AuthService
    const authStrategy = await authService.retrieveAuthenticationStrategyToUse(
      req,
      "admin"
    )
    await authStrategy.validate(req, res, next)
  }
}
