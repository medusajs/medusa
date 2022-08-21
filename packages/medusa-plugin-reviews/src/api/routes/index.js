import { Router } from "express"
import middlewares from "../middlewares"
import bodyParser from "body-parser"

const route = Router()

export default (app) => {
  app.use("/reviews", route)

  route.post(
    "/",
    bodyParser.json(),
    middlewares.wrap(require("./create-product-review").default)
  )
  route.get("/", middlewares.wrap(require("./list-product-reviews").default))

  return app
}
