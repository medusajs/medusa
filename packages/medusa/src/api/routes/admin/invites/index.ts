import { Router } from "express"
import { Invite } from "../../../../models/invite"
import { DeleteResponse } from "../../../../types/common"
import "reflect-metadata"

export const unauthenticatedInviteRoutes = (app) => {
  const route = Router()
  app.use("/invites", route)

  route.post("/accept", require("./accept-invite").default)
}

export default (app) => {
  const route = Router()
  app.use("/invites", route)

  route.get("/", require("./list-invites").default)

  route.post("/", require("./create-invite").default)

  route.post("/:invite_id/resend", require("./resend-invite").default)

  route.delete("/:invite_id", require("./delete-invite").default)

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
