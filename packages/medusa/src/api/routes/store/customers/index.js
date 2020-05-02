import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/customers", route)

  route.post("/", middlewares.wrap(require("./create-customer").default))

  // Authenticated endpoints
  route.use(middlewares.authenticate())

  route.param("id", middlewares.wrap(require("./authorize-customer").default))

  route.post("/:id", middlewares.wrap(require("./update-customer").default))

  return app
}
