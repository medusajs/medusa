import { Express } from 'express'
import bodyParser from "body-parser"
import { getConfigFile } from "medusa-core-utils"
import routes from "../api"
import { AwilixContainer } from "awilix"

type Options = {
  app: Express;
  rootDirectory: string;
  container: AwilixContainer
}

export default async ({ app, rootDirectory, container }: Options) => {
  const { configModule } = getConfigFile(rootDirectory, `medusa-config`) as { configModule: Record<string, unknown> }
  const config = (configModule && configModule.projectConfig) || {}

  app.use(bodyParser.json())
  app.use("/", routes(container, config))

  return app
}
