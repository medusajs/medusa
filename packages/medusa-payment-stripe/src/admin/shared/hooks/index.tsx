import { createCustomAdminHooks } from "medusa-react"

const { useAdminEntity } = createCustomAdminHooks(
  "admin/stripe-payments",
  "admin_stripe"
)

export { useAdminEntity }
