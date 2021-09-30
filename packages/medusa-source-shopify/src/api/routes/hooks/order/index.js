import express, { Router } from "express"
import middlewares from "../../../middlewares"
import fulfillment from "./fulfillment"

const route = Router()

export default (app) => {
  app.use("/order", route)

  fulfillment(route)

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
    "/payment",
    express.json(),
    middlewares.wrap(require("./payment").default)
  )
  route.use(
    "/update",
    express.json(),
    middlewares.wrap(require("./update").default)
  )
  route.use(
    "/cancel",
    express.json(),
    middlewares.wrap(require("./update").default)
  )

  return app
}
