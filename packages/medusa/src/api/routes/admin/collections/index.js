import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/collections", route)

  route.post("/", middlewares.wrap(require("./create-collection").default))
  route.post("/:id", middlewares.wrap(require("./update-collection").default))

  route.delete("/:id", middlewares.wrap(require("./delete-collection").default))

  route.get("/:id", middlewares.wrap(require("./get-collection").default))
  route.get("/", middlewares.wrap(require("./list-collections").default))

  return app
}

export const defaultFields = ["id", "title", "handle"]
export const defaultRelations = ["products"]
