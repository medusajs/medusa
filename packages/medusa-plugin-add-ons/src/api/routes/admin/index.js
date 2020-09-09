import { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "../../middlewares"

const route = Router()

export default (app) => {
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

  return app
}
