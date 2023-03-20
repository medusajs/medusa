import { Router } from "express"
import bodyParser from "body-parser"
import { wrapHandler } from "@medusajs/medusa"

const route = Router()

export default (app) => {
  app.use("/paypal/hooks", route)

  route.use(bodyParser.json())
  route.post("/", wrapHandler(require("./paypal").default))

  return app
}
