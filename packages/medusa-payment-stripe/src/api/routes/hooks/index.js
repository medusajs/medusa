import { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "../../middlewares"

const route = Router()

export default (app) => {
  app.use("/stripe", route)

  route.post(
    "/hooks",
    // stripe constructEvent fails without body-parser
    bodyParser.raw({ type: "application/json" }),
    middlewares.wrap(require("./stripe").default)
  )
  return app
}
