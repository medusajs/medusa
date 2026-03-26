import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.translation.batchSettings({
  create: [
    {
      entity_type: "product",
      fields: ["title", "description"],
      is_active: true
    }
  ],
  update: [
    {
      id: "trset_123",
      fields: ["title", "description", "subtitle"],
      is_active: true
    }
  ],
  delete: ["trset_456"]
})
.then(({ created, updated, deleted }) => {
  console.log(created, updated, deleted)
})