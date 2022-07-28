import { Router } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import middlewares from "../../middlewares"
import { getConfigFile } from "medusa-core-utils"
import { parseCorsOrigins } from "@medusajs/medusa/dist/utils"

const route = Router()

export default (app, rootDirectory) => {
  const { configModule } = getConfigFile(rootDirectory, `medusa-config`)
  const config = (configModule && configModule.projectConfig) || {}

  const storeCors = config.store_cors || ""
  route.use(
    cors({
      origin: parseCorsOrigins(storeCors),
      credentials: true,
    })
  )

  app.use("/adyen/webhooks", route)

  route.post(
    "/notification",
    bodyParser.json(),
    middlewares.wrap(require("./adyen-notification").default)
  )

  return app
}
