import { NextFunction, Request, Response } from "express"

export function checkRegisteredModules(services: {
  [serviceName: string]: string
}): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const service of Object.keys(services)) {
      if (!req.scope.resolve(service, { allowUnregistered: true })) {
        return next(new Error(services[service]))
      }
    }

    next()
  }
}
