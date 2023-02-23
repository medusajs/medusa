import stripeHooks from "./stripe"
import { Router } from "express"
import bodyParser from "body-parser"
import middlewares from "@medusajs/medusa/dist/api/middlewares"

const route = Router()

export default (app) => {
  app.use("/stripe", route)

  route.post(
    "/hooks",
    // stripe constructEvent fails without body-parser
    bodyParser.raw({ type: "application/json" }),
    middlewares.wrap(stripeHooks)
  )
  return app
}
