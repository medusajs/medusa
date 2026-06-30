import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.paymentCollection.createPaymentSession("paycol_123", {
  provider_id: "pp_stripe_stripe"
})
.then(({ payment_collection }) => {
  console.log(payment_collection)
})