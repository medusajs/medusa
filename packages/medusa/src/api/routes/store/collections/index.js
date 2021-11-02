import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/collections", route)

  route.get("/", middlewares.wrap(require("./list-collections").default))
  route.get("/:id", middlewares.wrap(require("./get-collection").default))

  return app
}

export const defaultFields = ["id", "title", "handle"]
export const defaultRelations = ["products"]
