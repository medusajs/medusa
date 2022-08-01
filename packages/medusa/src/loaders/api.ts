import { applyGlobalMiddlewares } from "../api/middlewares/apply-global-middlewares"
import { Express, Router } from 'express'
import bodyParser from "body-parser"
import routes from "../api"
import { AwilixContainer } from "awilix"
import { ConfigModule } from "../types/global"

applyGlobalMiddlewares(Router)

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
