import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/products", route)

  route.post("/", middlewares.wrap(require("./create-product").default))

  // route.get("/:productId", middlewares.wrap(require("./get-product").default))

  return app
}
