import express, { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/fulfillment", route)

  route.post(
    "/create",
    express.json(),
    middlewares.wrap(require("./create").default)
  )
  route.use(
    "/cancel",
    express.json(),
    middlewares.wrap(require("./update").default)
  )

  return app
}
