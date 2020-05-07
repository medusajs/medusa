import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/orders", route)

  route.get("/:id", middlewares.wrap(require("./get-order").default))

  route.post("/", middlewares.wrap(require("./create-order").default))
  route.post("/:id", middlewares.wrap(require("./update-order").default))

  route.post(
    "/:id/capture-payment",
    middlewares.wrap(require("./capture-payment").default)
  )
  route.post(
    "/:id/create-fulfillment",
    middlewares.wrap(require("./create-fulfillment").default)
  )
  route.post("/:id/return", middlewares.wrap(require("./return-order").default))
  route.post("/:id/cancel", middlewares.wrap(require("./cancel-order").default))

  return app
}
