import { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "../../middlewares"

const route = Router()

export default (app) => {
  app.use("/klarna", route)

  route.use(bodyParser.json())
  route.post("/address", middlewares.wrap(require("./address").default))
  route.post("/shipping", middlewares.wrap(require("./shipping").default))
  route.post("/push", middlewares.wrap(require("./push").default))

  return app
}
