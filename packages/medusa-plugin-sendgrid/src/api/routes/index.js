import { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "../../middlewares"

const route = Router()

export default (app) => {
  app.use("/mails", route)

  route.post(
    "/send",
    bodyParser.raw({ type: "application/json" }),
    middlewares.wrap(require("./send-email").default)
  )
  return app
}
