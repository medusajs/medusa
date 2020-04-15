import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/users", route)

  route.get("/", middlewares.wrap(require("./list-users").default))
  route.get("/:id", middlewares.wrap(require("./get-user").default))

  route.post("/", middlewares.wrap(require("./create-user").default))
  route.post("/:id", middlewares.wrap(require("./update-user").default))
  route.post(
    "/:id/set-password",
    middlewares.wrap(require("./set-password").default)
  )
  route.post(
    "/:id/reset-password-token",
    middlewares.wrap(require("./reset-password-token").default)
  )

  route.post(
    "/:id/reset-password",
    middlewares.wrap(require("./reset-password").default)
  )

  route.delete("/:id", middlewares.wrap(require("./delete-user").default))

  return app
}
