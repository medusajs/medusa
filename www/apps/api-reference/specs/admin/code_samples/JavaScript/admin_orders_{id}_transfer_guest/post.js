import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.order.transferToGuest("order_123", {
  email: "customer@example.com",
  internal_note: "Internal note",
})
.then(({ order }) => {
  console.log(order)
})