import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.stockLocations.list()
.then(({ stock_locations, limit, offset, count }) => {
  console.log(stock_locations.length);
});
