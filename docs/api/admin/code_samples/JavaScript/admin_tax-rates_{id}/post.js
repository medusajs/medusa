import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.taxRates.update(tax_rate_id, {
  name: 'New Tax Rate'
})
.then(({ tax_rate }) => {
  console.log(tax_rate.id);
});
