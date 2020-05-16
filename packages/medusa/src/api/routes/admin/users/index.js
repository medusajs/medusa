import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/users", route)

  route.get("/", middlewares.wrap(require("./list-users").default))
  route.get("/:user_id", middlewares.wrap(require("./get-user").default))

  route.post("/", middlewares.wrap(require("./create-user").default))
  route.post(
    "/password-token",
    middlewares.wrap(require("./reset-password-token").default)
  )

  route.post(
    "/reset-password",
    middlewares.wrap(require("./reset-password").default)
  )
  route.post("/:user_id", middlewares.wrap(require("./update-user").default))
  route.post(
    "/:user_id/set-password",
    middlewares.wrap(require("./set-password").default)
  )

  route.delete("/:user_id", middlewares.wrap(require("./delete-user").default))

  return app
}
