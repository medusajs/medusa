import { createCustomAdminHooks } from "medusa-react"

const { useAdminEntity } = createCustomAdminHooks(
  "/admin/orders/stripe-payments",
  "admin_stripe"
)

export { useAdminEntity }