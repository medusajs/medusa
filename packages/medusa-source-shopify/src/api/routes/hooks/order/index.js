import express, { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/order", route)

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
    "/fulfillment",
    express.json(),
    middlewares.wrap(require("./fulfillment").default)
  )
  route.use(
    "/update",
    express.json(),
    middlewares.wrap(require("./update").default)
  )

  return app
}
