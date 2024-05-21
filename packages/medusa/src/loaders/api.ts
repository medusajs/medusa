import { ContainerRegistrationKeys } from "@medusajs/utils"
import { Express } from "express"
import path from "path"
import qs from "qs"
import { RoutesLoader } from "./helpers/routing"
import { MedusaContainer, PluginDetails } from "@medusajs/types"

type Options = {
  app: Express
  plugins: PluginDetails[]
  container: MedusaContainer
}

export default async ({ app, container, plugins }: Options) => {
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
      configModule: container.resolve(ContainerRegistrationKeys.CONFIG_MODULE),
      rootDir: path.join(__dirname, "../api-v2"),
    }).load()
  } catch (err) {
    throw Error(
      "An error occurred while registering Medusa Core API Routes. See error in logs for more details.",
      { cause: err }
    )
  }

  await Promise.all(
    plugins.map(async (pluginDetails) => {
      return new RoutesLoader({
        app: app,
        configModule: container.resolve(
          ContainerRegistrationKeys.CONFIG_MODULE
        ),
        rootDir: path.join(pluginDetails.resolve, "api"),
      }).load()
    })
  )

  return app
}
