import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.product.linkOptions("prod_123", {
  add: [
      "opt_123",
      {
        id: "opt_123",
        value_ids: ["optval_1", "optval_2"]
      }
    ],
    remove: ["opt_456"]
})
.then(({ product }) => {
  console.log(product)
})