import { Router } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import middlewares from "../../middlewares"
import { getConfigFile } from "medusa-core-utils"

const route = Router()

export default (app, rootDirectory) => {
  const { configModule } = getConfigFile(rootDirectory, `medusa-config`)
  const config = (configModule && configModule.projectConfig) || {}

  const adminCors = config.admin_cors || ""

  route.use(
    cors({
      origin: adminCors.split(","),
      credentials: true,
    })
  )

  app.use("/admin", route)

  route.post(
    "/add-ons",
    bodyParser.json(),
    middlewares.wrap(require("./create-add-on").default)
  )

  route.post(
    "/add-ons/:id",
    bodyParser.json(),
    middlewares.wrap(require("./update-add-on").default)
  )

  route.get(
    "/add-ons",
    bodyParser.json(),
    middlewares.wrap(require("./list-add-ons").default)
  )

  route.get(
    "/add-ons/:id",
    bodyParser.json(),
    middlewares.wrap(require("./get-add-on").default)
  )

  route.delete(
    "/add-ons/:id",
    bodyParser.json(),
    middlewares.wrap(require("./delete-add-on").default)
  )

  return app
}
