import { FlagRouter } from "@medusajs/utils"
import { AwilixContainer } from "awilix"
import { Express } from "express"
import path from "path"
import qs from "qs"
import { RoutesLoader } from "./helpers/routing"
import { ConfigModule } from "@medusajs/types"

type Options = {
  app: Express
  container: AwilixContainer
  configModule: ConfigModule
  featureFlagRouter?: FlagRouter
}

export default async ({ app, configModule }: Options) => {
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

  // TODO: Figure out why this is causing issues with test when placed inside ./api.ts
  // Adding this here temporarily
  // Test: (packages/medusa/src/api/routes/admin/currencies/update-currency.ts)
  try {
    /**
     * Register the Medusa CORE API routes using the file based routing.
     */
    await new RoutesLoader({
      app: app,
      rootDir: path.join(__dirname, "../api-v2"),
      configModule,
    }).load()
  } catch (err) {
    throw Error(
      "An error occurred while registering Medusa Core API Routes. See error in logs for more details."
    )
  }

  return app
}
