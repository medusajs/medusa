import { Router } from "express"
import { Invite } from "../../../../models/invite"
import { DeleteResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"
import "reflect-metadata"

export const unauthenticatedInviteRoutes = (app) => {
  const route = Router()
  app.use("/invites", route)

  route.post("/accept", middlewares.wrap(require("./accept-invite").default))
}

export default (app) => {
  const route = Router()
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

/**
 * @schema AdminInviteDeleteRes
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Invite.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: invite
 *   deleted:
 *     type: boolean
 *     description: Whether or not the Invite was deleted.
 *     default: true
 */
export type AdminInviteDeleteRes = DeleteResponse

/**
 * @schema AdminListInvitesRes
 * type: object
 * properties:
 *   invites:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Invite"
 */
export type AdminListInvitesRes = {
  invites: Invite[]
}

export * from "./accept-invite"
export * from "./create-invite"
export * from "./delete-invite"
export * from "./list-invites"
export * from "./resend-invite"
