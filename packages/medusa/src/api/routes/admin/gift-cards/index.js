import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/gift-cards", route)

  route.get("/", middlewares.wrap(require("./list-gift-cards").default))

  route.post("/", middlewares.wrap(require("./create-gift-card").default))

  route.get("/:id", middlewares.wrap(require("./get-gift-card").default))

  route.post("/:id", middlewares.wrap(require("./update-gift-card").default))

  route.delete("/:id", middlewares.wrap(require("./delete-gift-card").default))

  return app
}

export const defaultFields = [
  "id",
  "code",
  "value",
  "balance",
  "region_id",
  "is_disabled",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const defaultRelations = ["region", "order"]

export const allowedFields = [
  "id",
  "code",
  "value",
  "balance",
  "region_id",
  "is_disabled",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const allowedRelations = ["region"]
