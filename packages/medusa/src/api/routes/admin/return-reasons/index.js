import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/return-reasons", route)

  /**
   * List reasons
   */
  route.get("/", middlewares.wrap(require("./list-reasons").default))

  /**
   * Retrieve reason
   */
  route.get("/:id", middlewares.wrap(require("./get-reason").default))

  /**
   * Create a reason
   */
  route.post("/", middlewares.wrap(require("./create-reason").default))

  /**
   * Update a reason
   */
  route.post("/:id", middlewares.wrap(require("./update-reason").default))

  return app
}

export const defaultFields = [
  "id",
  "value",
  "label",
  "description",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultRelations = []
