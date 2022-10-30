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
  name: string
  method: AllowedMethods
  path: string
  handler: Handler | Handler[]
  routes: MedusaRoute[]
  options: {}
}

export default ({
  app,
  configModule,
}: {
  app: Express
  configModule: ConfigModule
}) => {
  configModule.routes.map(async (customRoute) => {
    let { handler, path, method, routes, name } = customRoute

    if (!method || !path || !handler || !name) {
      console.warn(`Invalid config for custom route: ${name}`)
    }

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
