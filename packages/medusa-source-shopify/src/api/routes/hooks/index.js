import { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "../../middlewares"

const route = Router()

export default (app) => {
  app.use("/shopify", route)

  route.post(
    "/hooks",
    bodyParser.json(),
    middlewares.wrap(require("./shopify").default)
  )
  return app
}
