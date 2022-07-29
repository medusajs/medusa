import { Express, Router } from 'express'
import bodyParser from "body-parser"
import routes from "../api"
import { AwilixContainer } from "awilix"
import { ConfigModule } from "../types/global"

import { awaitMiddleware, checkCustomErrors } from "../api/middlewares";
import { RequestHandler } from "express-serve-static-core";
import { PartialRequestHandler } from '../api/middlewares/await-middleware'

["get", "post", "put", "delete"].forEach(function (method: string): void {
  Router[method] = function (path: string, ...handlers: RequestHandler[]) {
    const route = (this as unknown as Router).route(path)
    const finalHandler = handlers.pop() as RequestHandler
    handlers = [
      ...handlers,
      checkCustomErrors,
      awaitMiddleware(finalHandler as PartialRequestHandler),
    ]
    route[method].apply(route, handlers)
    return this
  }
})

type Options = {
  app: Express
  container: AwilixContainer
  configModule: ConfigModule
}

export default async ({ app, container, configModule }: Options) => {
  app.use(bodyParser.json())
  app.use("/", routes(container, configModule.projectConfig))

  return app
}
