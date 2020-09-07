import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/orders", route)

  route.get("/", middlewares.wrap(require("./list-orders").default))
  route.get("/:id", middlewares.wrap(require("./get-order").default))

  route.post("/", middlewares.wrap(require("./create-order").default))
  route.post("/:id", middlewares.wrap(require("./update-order").default))
  route.post(
    "/:id/complete",
    middlewares.wrap(require("./complete-order").default)
  )

  route.post(
    "/:id/refund",
    middlewares.wrap(require("./refund-payment").default)
  )
  route.post(
    "/:id/capture",
    middlewares.wrap(require("./capture-payment").default)
  )
  route.post(
    "/:id/shipment",
    middlewares.wrap(require("./create-shipment").default)
  )

  route.post(
    "/:id/fulfillment",
    middlewares.wrap(require("./create-fulfillment").default)
  )
  route.post("/:id/return", middlewares.wrap(require("./return-order").default))
  route.post("/:id/cancel", middlewares.wrap(require("./cancel-order").default))
  route.post(
    "/:id/archive",
    middlewares.wrap(require("./archive-order").default)
  )

  return app
}
