import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.priceLists.listProducts(price_list_id)
.then(({ products, limit, offset, count }) => {
  console.log(products.length);
});
