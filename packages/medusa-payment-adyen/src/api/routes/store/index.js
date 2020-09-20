import { Router } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import middlewares from "../../middlewares"
import { getConfigFile } from "medusa-core-utils"

const route = Router()

export default (app, rootDirectory) => {
  const { configModule } = getConfigFile(rootDirectory, `medusa-config`)
  const config = (configModule && configModule.projectConfig) || {}

  const storeCors = config.store_cors || ""
  route.use(
    cors({
      origin: storeCors.split(","),
      credentials: true,
    })
  )

  app.use("/adyen", route)

  route.post(
    "/payment-methods",
    bodyParser.json(),
    middlewares.wrap(require("./retrieve-payment-methods").default)
  )

  route.post(
    "/apple-pay-session",
    bodyParser.json(),
    middlewares.wrap(require("./apple-pay-session").default)
  )

  route.post(
    "/authorize",
    bodyParser.json(),
    middlewares.wrap(require("./authorize-payment").default)
  )

  route.post(
    "/update",
    bodyParser.json(),
    middlewares.wrap(require("./update-payment").default)
  )

  route.post(
    "/payment-status",
    bodyParser.json(),
    middlewares.wrap(require("./check-payment-result").default)
  )
  
  route.post(
    "/additional-details",
    bodyParser.json(),
    middlewares.wrap(require("./additional-details").default)
  )

  route.post(
    "/update-cart-payment/:cart_id",
    bodyParser.json(),
    middlewares.wrap(require("./update-cart-payment").default)
  )

  return app
}
