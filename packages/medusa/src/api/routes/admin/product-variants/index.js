import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/product-variants", route)

  route.post("/", middlewares.wrap(require("./create-product-variant").default))
  route.post(
    "/:id",
    middlewares.wrap(require("./update-product-variant").default)
  )

  route.post(
    "/:id/publish",
    middlewares.wrap(require("./publish-product-variant").default)
  )

  route.post("/:id/prices", middlewares.wrap(require("./add-price").default))

  route.post(
    "/:id/options",
    middlewares.wrap(require("./add-option-value").default)
  )

  route.delete(
    "/:id/options",
    middlewares.wrap(require("./delete-option-value").default)
  )

  route.delete(
    "/:id",
    middlewares.wrap(require("./delete-product-variant").default)
  )

  route.get("/:id", middlewares.wrap(require("./get-product-variant").default))
  route.get("/", middlewares.wrap(require("./list-product-variants").default))

  return app
}
