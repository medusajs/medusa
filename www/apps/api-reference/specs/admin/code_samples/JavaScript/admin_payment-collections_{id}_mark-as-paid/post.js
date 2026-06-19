import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.paymentCollection.markAsPaid("paycol_123", {
  order_id: "order_123",
  // optional: record the payment under a specific provider
  provider_id: "pp_system_default"
})
.then(({ payment_collection }) => {
  console.log(payment_collection)
})