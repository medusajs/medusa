import bodyParser from "body-parser"
import cors from "cors"
import { Router } from "express"
import { getConfigFile, parseCorsOrigins } from "medusa-core-utils"
import middlewares from "../middleware"

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

  app.use("/mailchimp", route)

  route.post(
    "/subscribe",
    bodyParser.json(),
    middlewares.wrap(require("./subscribe-newsletter").default)
  )
  return app
}
