import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/discounts", route)

  route.get("/", middlewares.wrap(require("./list-discounts").default))
  route.post("/", middlewares.wrap(require("./create-discount").default))

  route.get(
    "/:discount_id",
    middlewares.wrap(require("./get-discount").default)
  )
  route.post(
    "/:discount_id",
    middlewares.wrap(require("./update-discount").default)
  )
  route.delete(
    "/:discount_id",
    middlewares.wrap(require("./delete-discount").default)
  )

  // Discount valid variants management
  route.post(
    "/:discount_id/variants/:variant_id",
    middlewares.wrap(require("./add-valid-variant").default)
  )
  route.delete(
    "/:discount_id/variants/:variant_id",
    middlewares.wrap(require("./remove-valid-variant").default)
  )

  // Discount region management
  route.post(
    "/:discount_id/regions/:region_id",
    middlewares.wrap(require("./add-region").default)
  )
  route.delete(
    "/:discount_id/regions/:region_id",
    middlewares.wrap(require("./remove-region").default)
  )

  return app
}
