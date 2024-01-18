import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.shippingOptions.listCartOptions(cartId)
.then(({ shipping_options }) => {
  console.log(shipping_options.length);
})
