import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.priceLists.list()
.then(({ price_lists, limit, offset, count }) => {
  console.log(price_lists.length);
});
