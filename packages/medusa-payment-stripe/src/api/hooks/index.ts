import stripeHooks from "./stripe"
import { Router } from "express"
import bodyParser from "body-parser"
import { wrapHandler } from "@medusajs/medusa"

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
