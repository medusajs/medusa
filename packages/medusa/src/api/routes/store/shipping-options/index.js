import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/shipping-options", route)

  route.get("/", middlewares.wrap(require("./get-shipping-options").default))

  return app
}
