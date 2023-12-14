import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.inventoryItems.list()
.then(({ inventory_items, count, offset, limit }) => {
  console.log(inventory_items.length);
})
