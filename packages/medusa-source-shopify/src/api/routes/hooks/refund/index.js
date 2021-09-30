import express, { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/refund", route)

  route.post(
    "/create",
    express.json(),
    middlewares.wrap(require("./create").default)
  )

  return app
}
