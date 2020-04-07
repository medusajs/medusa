import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/shipping-options", route)

  route.get("/", middlewares.wrap(require("./list-shipping-options").default))
  route.post("/", middlewares.wrap(require("./create-shipping-option").default))

  route.get(
    "/:option_id",
    middlewares.wrap(require("./get-shipping-option").default)
  )
  route.post(
    "/:option_id",
    middlewares.wrap(require("./update-shipping-option").default)
  )
  route.delete(
    "/:option_id",
    middlewares.wrap(require("./delete-shipping-option").default)
  )

  return app
}
