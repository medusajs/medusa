import { createCustomAdminHooks } from "medusa-react"

const { useAdminEntity } = createCustomAdminHooks(
  "admin/orders/:order_id/stripe-payments",
  "admin_stripe"
)

export { useAdminEntity }
