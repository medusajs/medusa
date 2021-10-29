import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/notifications", route)

  /**
   * List notifications
   */
  route.get("/", middlewares.wrap(require("./list-notifications").default))

  /**
   * Resend a notification
   */
  route.post(
    "/:id/resend",
    middlewares.wrap(require("./resend-notification").default)
  )

  return app
}

export const defaultRelations = ["resends"]
export const allowedRelations = ["resends"]

export const defaultFields = [
  "id",
  "resource_type",
  "resource_id",
  "event_name",
  "to",
  "provider_id",
  "created_at",
  "updated_at",
]

export const allowedFields = [
  "id",
  "resource_type",
  "resource_id",
  "provider_id",
  "event_name",
  "to",
  "created_at",
  "updated_at",
]
