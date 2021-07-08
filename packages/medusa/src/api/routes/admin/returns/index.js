import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/returns", route)

  /**
   * List returns
   */
  route.get("/", middlewares.wrap(require("./list-returns").default))

  route.post(
    "/:id/receive",
    middlewares.wrap(require("./receive-return").default)
  )

  route.post(
    "/:id/cancel",
    middlewares.wrap(require("./cancel-return").default)
  )

  return app
}
