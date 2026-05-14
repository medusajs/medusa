import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.translation.batch({
  create: [
    {
      reference_id: "prod_123",
      reference: "product",
      locale_code: "en-US",
      translations: { title: "Shirt" }
    }
  ],
  update: [
    {
      id: "trans_123",
      translations: { title: "Pants" }
    }
  ],
  delete: ["trans_321"]
})
.then(({ created, updated, deleted }) => {
  console.log(created, updated, deleted)
})