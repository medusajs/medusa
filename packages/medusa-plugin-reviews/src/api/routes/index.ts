import { Router } from "express"
import middlewares from "../middlewares"

const route = Router()

export default (app) => {
  app.use("/reviews", route)

  route.post("/", middlewares.wrap(require("./create-product-review").default))
  route.get("/", middlewares.wrap(require("./list-product-reviews").default))

  return app
}

export * from "./create-product-review"
export * from "./list-product-reviews"
