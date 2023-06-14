import { Express } from "express"
import bodyParser from "body-parser"
import routes from "../api"
import { AwilixContainer } from "awilix"
import { ConfigModule } from "../types/global"

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
