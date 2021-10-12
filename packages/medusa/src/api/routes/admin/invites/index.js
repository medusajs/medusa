import { Router } from "express"
import middlewares from "../../../middlewares"
const route = Router()

export const unauthenticatedInviteRoutes = app => {
  app.use("/invites", route)

  route.post("/accept", middlewares.wrap(require("./accept-invite").default))
}

export default app => {
  app.use("/invites", route)

  route.get("/", middlewares.wrap(require("./list-invites").default))

  route.post("/", middlewares.wrap(require("./create-invite").default))

  route.post(
    "/:invite_id/resend",
    middlewares.wrap(require("./resend-invite").default)
  )

  route.delete(
    "/:invite_id",
    middlewares.wrap(require("./delete-invite").default)
  )

  return app
}
