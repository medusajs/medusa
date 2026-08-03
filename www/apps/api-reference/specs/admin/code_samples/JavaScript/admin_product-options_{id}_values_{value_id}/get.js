import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.productOption.retrieveValue("opt_123", "optval_123")
.then(({ product_option_value }) => {
  console.log(product_option_value)
})