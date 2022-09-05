import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.taxRates.retrieve(tax_rate_id)
.then(({ tax_rate }) => {
  console.log(tax_rate.id);
});
