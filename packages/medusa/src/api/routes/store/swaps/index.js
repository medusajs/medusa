import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/swaps", route)

  route.get(
    "/:cart_id",
    middlewares.wrap(require("./get-swap-by-cart").default)
  )
  route.post("/", middlewares.wrap(require("./create-swap").default))

  return app
}
