import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/orders", route)

  route.get("/:id", middlewares.wrap(require("./get-order").default))

  route.get(
    "/cart/:cart_id",
    middlewares.wrap(require("./get-order-by-cart").default)
  )

  route.post("/", middlewares.wrap(require("./create-order").default))

  return app
}
