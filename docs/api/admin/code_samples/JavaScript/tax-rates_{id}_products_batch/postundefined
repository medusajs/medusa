import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.taxRates.addProducts(tax_rate_id, {
  products: [
    product_id
  ]
})
.then(({ tax_rate }) => {
  console.log(tax_rate.id);
});
