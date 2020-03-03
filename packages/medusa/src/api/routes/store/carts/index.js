import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/carts", route)

  route.get("/:id", middlewares.wrap(require("./get-cart").default))

  route.post("/", middlewares.wrap(require("./create-cart").default))
  route.post("/:id", middlewares.wrap(require("./update-cart").default))

  // Line items
  route.post(
    "/:id/line-items",
    middlewares.wrap(require("./create-line-item").default)
  )
  route.post(
    "/:id/line-items/:line_id",
    middlewares.wrap(require("./update-line-item").default)
  )

  return app
}
