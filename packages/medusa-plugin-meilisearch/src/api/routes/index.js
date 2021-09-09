import { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "../middlewares"

const route = Router()

export default (app) => {
  app.use("/meilisearch", route)

  route.post(
    "/search",
    bodyParser.json(),
    middlewares.wrap(require("./meilisearch").default)
  )

  return app
}
