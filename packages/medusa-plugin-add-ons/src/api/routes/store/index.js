import { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "../../middlewares"

const route = Router()

export default (app) => {
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
