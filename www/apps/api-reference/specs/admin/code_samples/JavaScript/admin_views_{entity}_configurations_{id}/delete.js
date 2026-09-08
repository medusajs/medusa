import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

const { id, object, deleted } = await sdk.admin.views.deleteConfiguration(
  "orders",
  "viewconfig_123"
)