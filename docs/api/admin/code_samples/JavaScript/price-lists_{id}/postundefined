import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.priceLists.update(price_list_id, {
  name: 'New Price List'
})
.then(({ price_list }) => {
  console.log(price_list.id);
});
