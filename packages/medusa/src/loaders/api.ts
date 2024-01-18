import { AwilixContainer } from "awilix"
import bodyParser from "body-parser"
import { Express } from "express"
import path from "path"
import qs from "qs"
import routes from "../api"
import { ConfigModule } from "../types/global"
import { RoutesLoader } from "./helpers/routing"

type Options = {
  app: Express
  container: AwilixContainer
  configModule: ConfigModule
}

export default async ({ app, container, configModule }: Options) => {
  // This is a workaround for the issue described here: https://github.com/expressjs/express/issues/3454
  // We parse the url and get the qs to be parsed and override the query prop from the request
  app.use(function (req, res, next) {
    const parsedUrl = req.url.split("?")
    parsedUrl.shift()
    const queryParamsStr = parsedUrl.join("?")
    if (queryParamsStr) {
      req.query = qs.parse(queryParamsStr, { arrayLimit: Infinity })
    }
    next()
  })

  app.use(bodyParser.json())
  app.use("/", routes(container, configModule.projectConfig))

  try {
    /**
     * Register the Medusa CORE API routes using the file based routing.
     */
    await new RoutesLoader({
      app,
      rootDir: path.join(__dirname, "../api-v2"),
      configModule,
    }).load()
  } catch (err) {
    throw Error("An error occurred while registering Medusa Core API Routes")
  }

  return app
}
