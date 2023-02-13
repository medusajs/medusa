import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.inventoryItems.updateLocationLevel(inventoryItemId, locationId, {
  stocked_quantity: 15,
})
.then(({ inventory_item }) => {
  console.log(inventory_item.id);
});
