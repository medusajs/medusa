import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.priceLists.addPrices(price_list_id, {
  prices: [
    {
      amount: 1000,
      variant_id,
      currency_code: 'eur'
    }
  ]
})
.then(({ price_list }) => {
  console.log(price_list.id);
});
