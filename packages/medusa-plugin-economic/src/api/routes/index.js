import { Router } from "express"
import middlewares from "../../middlewares"

const route = Router()

export default (app) => {
  app.use("/economic", route)

  route.post(
    "/draft-invoice",
    middlewares.wrap(require("./create-draft-invoice").default)
  )

  route.post(
    "/book-invoice",
    middlewares.wrap(require("./book-invoice").default)
  )

  return app
}
