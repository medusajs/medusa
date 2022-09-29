import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.shippingOptions.update(option_id, {
  name: 'PostFake',
  requirements: [
    {
      id,
      type: 'max_subtotal',
      amount: 1000
    }
  ]
})
.then(({ shipping_option }) => {
  console.log(shipping_option.id);
});
