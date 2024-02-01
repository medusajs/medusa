import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.variants.getInventory(variantId)
.then(({ variant }) => {
  console.log(variant.inventory, variant.sales_channel_availability)
})
