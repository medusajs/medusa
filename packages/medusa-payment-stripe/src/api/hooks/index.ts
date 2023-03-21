import { wrapHandler } from "@medusajs/medusa"
import bodyParser from "body-parser"
import { Router } from "express"
import stripeHooks from "./stripe"

const route = Router()

export default (app) => {
  app.use("/stripe", route)

  route.post(
    "/hooks",
    // stripe constructEvent fails without body-parser
    bodyParser.raw({ type: "application/json" }),
    wrapHandler(stripeHooks)
  )
  return app
}
