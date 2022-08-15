import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.regions.create({
  name: 'Europe',
  currency_code: 'eur',
  tax_rate: 0,
  payment_providers: [
    'manual'
  ],
  fulfillment_providers: [
    'manual'
  ],
  countries: [
    'DK'
  ]
})
.then(({ region }) => {
  console.log(region.id);
});
