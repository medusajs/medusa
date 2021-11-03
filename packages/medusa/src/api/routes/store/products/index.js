import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/products", route)

  route.get("/", middlewares.wrap(require("./list-products").default))
  route.post("/search", middlewares.wrap(require("./search").default))
  route.get("/:id", middlewares.wrap(require("./get-product").default))

  return app
}

export const defaultRelations = [
  "variants",
  "variants.prices",
  "variants.options",
  "options",
  "options.values",
  "images",
  "tags",
  "collection",
  "type",
]
