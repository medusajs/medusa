import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.productOption.listValues("opt_123", { q: "red" })
.then(({ product_option_values, count, limit, offset }) => {
  console.log(product_option_values)
})