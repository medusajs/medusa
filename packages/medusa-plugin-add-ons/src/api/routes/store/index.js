import { Router } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import middlewares from "../../middlewares"
import { getConfigFile } from "medusa-core-utils"

const route = Router()

export default (app, rootDirectory) => {
  const { configModule } = getConfigFile(rootDirectory, `medusa-config`)
  const config = (configModule && configModule.projectConfig) || {}

  const storeCors = config.store_cors || ""

  route.use(
    cors({
      origin: storeCors.split(","),
      credentials: true,
    })
  )

  app.use("/store", route)

  route.post(
    "/carts/:id/line-items/add-on",
    bodyParser.json(),
    middlewares.wrap(require("./create-line-item").default)
  )

  route.post(
    "/carts/:id/line-items/:line_id/add-on",
    bodyParser.json(),
    middlewares.wrap(require("./update-line-item").default)
  )

  return app
}
