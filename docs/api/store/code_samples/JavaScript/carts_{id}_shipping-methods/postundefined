import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.carts.addShippingMethod(cart_id, {
  option_id
})
.then(({ cart }) => {
  console.log(cart.id);
});
