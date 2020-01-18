import { Router } from "express"
import middlewares from "../../middlewares"

const route = Router()

export default app => {
  app.use("/admin", route)

  // Unauthenticated routes
  // route.use("/auth", require("./auth").default)

  // Authenticated routes
  route.use(middlewares.authenticate())
  route.use("/products", require("./products").default)
  route.use("/product-variants", require("./product-variants").default)

  return app
}
