import { Router } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { getConfigFile, parseCorsOrigins } from "medusa-core-utils"

import middlewares from "../middleware"

const route = Router()

export default (app, rootDirectory) => {
  app.use("/restock-notifications", route)

  const { configModule } = getConfigFile(rootDirectory, "medusa-config")
  const { projectConfig } = configModule

  const corsOptions = {
    origin: parseCorsOrigins(projectConfig.store_cors),
    credentials: true,
  }

  route.options("/variants/:variant_id", cors(corsOptions))
  route.post(
    "/variants/:variant_id",
    cors(corsOptions),
    bodyParser.json(),
    middlewares.wrap(require("./add-email").default)
  )
  return app
}
