import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/shipping-options", route)

  route.get("/", middlewares.wrap(require("./list-shipping-options").default))

  return app
}
