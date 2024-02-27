import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { getStripePayments } from "../../../../../controllers/get-payments"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const payments = await getStripePayments(req)
  res.json({ payments })
}
