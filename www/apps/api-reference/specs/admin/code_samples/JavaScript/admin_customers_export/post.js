import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.customer.export({
  format: "json"
}, {
  fields: "id,email,*addresses,*orders",
  id: "cus_123"
})
.then(({ transaction_id }) => {
  console.log(transaction_id)
})