import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.inventoryItems.createLocationLevel(inventoryItemId, {
  location_id: 'sloc',
  stocked_quantity: 10,
})
.then(({ inventory_item }) => {
  console.log(inventory_item.id);
});
