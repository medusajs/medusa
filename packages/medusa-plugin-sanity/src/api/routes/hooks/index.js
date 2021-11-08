import { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "../../middlewares"

const route = Router()

export default (app) => {
  app.use("/hooks", route)

  route.post(
    "/sanity",
    bodyParser.json(),
    middlewares.wrap(require("./sanity").default)
  )

  return app
}
