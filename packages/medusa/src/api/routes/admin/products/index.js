import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/products", route)

  route.post("/", middlewares.wrap(require("./create-product").default))
  route.post("/:id", middlewares.wrap(require("./update-product").default))
  route.post(
    "/:id/publish",
    middlewares.wrap(require("./publish-product").default)
  )

  route.post(
    "/:id/variants",
    middlewares.wrap(require("./create-variant").default)
  )

  route.post(
    "/:id/variants/:variant_id",
    middlewares.wrap(require("./update-variant").default)
  )

  route.post(
    "/:id/options/:optionId",
    middlewares.wrap(require("./update-option").default)
  )
  route.post("/:id/options", middlewares.wrap(require("./add-option").default))

  route.delete(
    "/:id/variants/:variantId",
    middlewares.wrap(require("./delete-variant").default)
  )
  route.delete("/:id", middlewares.wrap(require("./delete-product").default))
  route.delete(
    "/:id/options/:optionId",
    middlewares.wrap(require("./delete-option").default)
  )

  route.get("/:id", middlewares.wrap(require("./get-product").default))
  route.get("/", middlewares.wrap(require("./list-products").default))

  return app
}
