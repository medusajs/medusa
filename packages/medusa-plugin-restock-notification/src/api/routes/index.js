import { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "../middleware"

const route = Router()

export default (app) => {
  app.use("/restock-notifications", route)

  route.post(
    "/variants/:variant_id",
    bodyParser.json(),
    middlewares.wrap(require("./add-email").default)
  )
  return app
}
