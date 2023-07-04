import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.priceLists.retrieve(price_list_id)
.then(({ price_list }) => {
  console.log(price_list.id);
});
