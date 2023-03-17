import { Router } from "express"
import bodyParser from "body-parser"
import { wrapHandler } from "@medusajs/medusa"

const route = Router()

export default (app) => {
  app.use("/paypal", route)

  route.use(bodyParser.json())
  route.post("/hooks", wrapHandler(require("./paypal").default))
  return app
}
