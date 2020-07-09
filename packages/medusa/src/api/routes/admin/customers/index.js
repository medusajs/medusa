import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/customers", route)

  route.get("/", middlewares.wrap(require("./list-customers").default))
  route.get("/:id", middlewares.wrap(require("./get-customer").default))

  route.post("/", middlewares.wrap(require("./create-customer").default))
  route.post(
    "/:id/password",
    middlewares.wrap(require("./update-password").default)
  )
  return app
}
