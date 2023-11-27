import { authenticate } from "@medusajs/medusa"
import { ConfigModule } from "@medusajs/types"
import getConfigFile from "@medusajs/utils/dist/common/get-config-file"
import cors from "cors"
import { Router } from "express"
import { getStripePayments } from "../controllers/get-payments"
import hooks from "./hooks"

export default (rootDirectory) => {
  const app = Router()

  hooks(app)

  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  )

  const corsOptions = {
    origin: configModule?.projectConfig?.admin_cors?.split(","),
    credentials: true,
  }

  app.use(
    `/admin/orders/stripe-payments/:order_id`,
    cors(corsOptions),
    authenticate()
  )
  app.get(`/admin/orders/stripe-payments/:order_id`, async (req, res) => {
    const payments = await getStripePayments(req)
    res.json({ payments })
  })

  return app
}
