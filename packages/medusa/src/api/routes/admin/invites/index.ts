import { Router } from "express"
import { Invite } from "../../../../models/invite"
import { DeleteResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"
import "reflect-metadata"

const route = Router()

export const unauthenticatedInviteRoutes = (app) => {
  app.use("/invites", route)

  route.post("/accept", middlewares.wrap(require("./accept-invite").default))
}

export default (app) => {
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

export type AdminInviteDeleteRes = DeleteResponse

export type AdminListInvitesRes = {
  invites: Invite[]
}

export * from "./accept-invite"
export * from "./create-invite"
export * from "./delete-invite"
export * from "./list-invites"
export * from "./resend-invite"
