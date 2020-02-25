import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/carts", route)

  route.get("/:cartId", middlewares.wrap(require("./get-cart").default))
  route.post("/", middlewares.wrap(require("./create-cart").default))

  return app
}
