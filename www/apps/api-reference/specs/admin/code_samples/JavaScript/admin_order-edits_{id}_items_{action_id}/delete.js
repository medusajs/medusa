import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.orderEdit.removeAddedItem(
  "order_123",
  "orli_123",
)
.then(({ order_preview }) => {
  console.log(order_preview)
})