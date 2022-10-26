import { Express, NextFunction, Request, Response } from "express"
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
  configModule.customRoutes.map(async (customRoute) => {
    await validateRouteConfig(customRoute)

    let { handler, path, method, options } = customRoute

    handler = Array.isArray(handler) ? handler : [handler]

    app[method.toLowerCase()](path, handler)
  })

  return app
}
