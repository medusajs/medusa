import { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "../../middlewares"

const route = Router()

export default (app) => {
  app.use("/razorpay", route)

  route.post(
    "/hooks",
    // razorpay constructEvent fails without body-parser
    bodyParser.raw({ type: "application/json" }),
    middlewares.wrap(require("./razorpay").default)
  )
  return app
}
