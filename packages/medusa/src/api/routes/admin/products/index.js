import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  // Inject <rootDir>/api/routes/admin/products/router.js
  // Inject <rootDir>/plugins/*/api/routes/admin/products/router.js
  // Inject <rootDir>/node_modules/*/api/routes/admin/products/router.js


  app.use("/products", route)

  route.post("/", middlewares.wrap(require("./create-product").default))

  // route.get("/:productId", middlewares.wrap(require("./get-product").default))

  return app
}
