import { Router } from "express"
import middlewares from "../../middlewares"

const route = Router()

export default app => {
  app.use("/users", route)

  route.get("/", middlewares.wrap(require("./list-users").default))
  route.get("/:productId", middlewares.wrap(require("./get-user").default))
  route.post("/", middlewares.wrap(require("./create-user").default))
  route.post(
    "/:productId/set-password",
    middlewares.wrap(require("./set-password").default)
  )
  route.post(
    "/:productId/reset-password",
    middlewares.wrap(require("./reset-password-token").default)
  )

  return app
}
