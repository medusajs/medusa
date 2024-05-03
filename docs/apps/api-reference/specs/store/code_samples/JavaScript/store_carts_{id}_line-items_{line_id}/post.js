import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.carts.lineItems.update(cartId, lineId, {
  quantity: 1
})
.then(({ cart }) => {
  console.log(cart.id);
})
