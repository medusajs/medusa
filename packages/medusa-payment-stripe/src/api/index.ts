import { authenticate } from "@medusajs/medusa"
import { Router } from "express"
import { getStripePayments } from "../controllers/get-payments"
import hooks from "./hooks"

export default (container) => {
  const app = Router()

  hooks(app)

  app.options(`/admin/stripe-payments/:order_id`, authenticate())
  app.get(
    `/admin/stripe-payments/:order_id`,
    authenticate(),
    async (req, res) => {
      const payments = await getStripePayments(req)
      res.json({ payments })
    }
  )

  return app
}
