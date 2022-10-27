import { Express, NextFunction, Request, Response, Router } from "express"
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

export type MedusaRoute = {
  method: AllowedMethods
  path: string
  handler: Handler | Handler[]
  routes: MedusaRoute[]
  options: {}
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
  configModule.routes.map(async (customRoute) => {
    await validateRouteConfig(customRoute)

    let { handler, path, method, routes } = customRoute

    if (routes) {
      const subRouter = Router({ mergeParams: true })

      app.use(path, subRouter)

      routes.map((route) => {
        const { handler, path, method } = route
        subRouter[method.toLowerCase()](path, handler)
      })
    } else {
      handler = Array.isArray(handler) ? handler : [handler]

      app[method.toLowerCase()](path, handler)
    }
  })

  return app
}
