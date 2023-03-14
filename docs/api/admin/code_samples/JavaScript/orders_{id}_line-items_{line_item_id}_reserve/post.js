import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.orders.createReservation(order_id, line_item_id, {
  location_id
})
.then(({ reservation }) => {
  console.log(reservation.id);
});
