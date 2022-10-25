import { Express, NextFunction, Request, Response } from "express"
import middlewares from "../api/middlewares"
import { ConfigModule } from "../types/global"

enum AllowedMethods {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
}

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>

export type CustomEndpoint = {
  method: AllowedMethods
  path: string
  handler: Handler | Handler[]
  options: {
    requires_auth?: boolean
  }
}

const validateRouteConfig = async (customRoute) => {
  const { handler, path, method } = customRoute
  if (!method || !path || !handler) {
    console.warn("Invalid route config")
  }
}

export default ({
  app,
  configModule,
}: {
  app: Express
  configModule: ConfigModule
}) => {
  const createRoute = async (customRoute: CustomEndpoint) => {
    await validateRouteConfig(customRoute)

    const { handler, path, method, options } = customRoute

    if (options.requires_auth) {
      app.use(path, middlewares.authenticate())
    }

    if (Array.isArray(handler)) {
      handler.forEach((h) => app[method.toLowerCase()](path, h))
    } else {
      app[method.toLowerCase()](path, handler)
    }
  }

  configModule.customRoutes.map(async (customRoute) => createRoute(customRoute))

  return app
}
