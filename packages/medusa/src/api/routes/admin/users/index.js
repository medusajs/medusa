import { Router } from "express"
import middlewares from "../../../middlewares"
const route = Router()

export const unauthenticatedUserRoutes = app => {
  app.use("/users", route)

  route.post(
    "/password-token",
    middlewares.wrap(require("./reset-password-token").default)
  )

  route.post(
    "/reset-password",
    middlewares.wrap(require("./reset-password").default)
  )

  route.post(
    "/invite/accept",
    middlewares.wrap(require("./accept-invite").default)
  )
}

export default app => {
  app.use("/users", route)

  route.get("/:user_id", middlewares.wrap(require("./get-user").default))

  route.post("/", middlewares.wrap(require("./create-user").default))

  route.post("/invite", middlewares.wrap(require("./create-invite").default))

  route.post(
    "/invite/:invite_id/resend",
    middlewares.wrap(require("./resend-invite").default)
  )

  route.delete(
    "/invite/:invite_id",
    middlewares.wrap(require("./delete-invite").default)
  )

  route.post("/:user_id", middlewares.wrap(require("./update-user").default))

  route.delete("/:user_id", middlewares.wrap(require("./delete-user").default))

  route.get("/", middlewares.wrap(require("./list-users").default))

  return app
}
