import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.taxRates.list()
.then(({ tax_rates, limit, offset, count }) => {
  console.log(tax_rates.length);
});
