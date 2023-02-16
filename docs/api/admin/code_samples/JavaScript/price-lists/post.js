import Medusa from "@medusajs/medusa-js"
import { PriceListType } from "@medusajs/medusa"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.priceLists.create({
  name: 'New Price List',
  description: 'A new price list',
  type: PriceListType.SALE,
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
