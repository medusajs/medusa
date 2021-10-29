import { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "../../middlewares"

const route = Router()

export default (app) => {
  app.use("/hooks", route)

  route.post(
    "/datoCMS",
    bodyParser.json(),
    middlewares.wrap(require("./datoCMS").default)
  )

  return app
}
