import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.products.createVariant(product_id, {
  title: 'Color',
  prices: [
    {
      amount: 1000,
      currency_code: "eur"
    }
  ],
  options: [
    {
      option_id,
      value: 'S'
    }
  ],
  inventory_quantity: 100
})
.then(({ product }) => {
  console.log(product.id);
});
