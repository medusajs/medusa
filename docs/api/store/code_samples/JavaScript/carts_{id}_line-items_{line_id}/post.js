import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.carts.lineItems.update(cart_id, line_id, {
  quantity: 1
})
.then(({ cart }) => {
  console.log(cart.id);
});
