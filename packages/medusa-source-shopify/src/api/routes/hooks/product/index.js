import express, { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/product", route)

  route.post(
    "/create",
    express.json(),
    middlewares.wrap(require("./create").default)
  )
  route.use(
    "/delete",
    express.json(),
    middlewares.wrap(require("./delete").default)
  )
  route.use(
    "/update",
    express.json(),
    middlewares.wrap(require("./update").default)
  )

  return app
}
