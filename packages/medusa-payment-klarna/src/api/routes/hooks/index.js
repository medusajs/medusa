import { Router } from "express"
import middlewares from "../../middlewares"

const route = Router()

export default (app) => {
  app.use("/hooks", route)

  route.post("/shipping", middlewares.wrap(require("./shippping").default))
  route.post("/address", middlewares.wrap(require("./address").default))
  route.post("/push", middlewares.wrap(require("./push").default))

  return app
}
