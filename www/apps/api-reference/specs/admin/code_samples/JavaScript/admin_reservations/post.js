import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.reservations.create({
  line_item_id: "item_123",
  location_id: "loc_123",
  inventory_item_id: "iitem_123",
  quantity: 1
})
.then(({ reservation }) => {
  console.log(reservation.id);
})
