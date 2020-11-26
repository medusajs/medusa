import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/product-variants", route)

  route.get("/:id", middlewares.wrap(require("./get-variant").default))

  return app
}
