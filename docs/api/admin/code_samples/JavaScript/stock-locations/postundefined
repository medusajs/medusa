import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.stockLocations.create({
  name: 'Main Warehouse',
  location_id: 'sloc'
})
.then(({ stock_location }) => {
  console.log(stock_location.id);
});
