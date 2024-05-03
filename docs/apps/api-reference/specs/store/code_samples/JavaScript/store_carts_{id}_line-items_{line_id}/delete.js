import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.carts.lineItems.delete(cartId, lineId)
.then(({ cart }) => {
  console.log(cart.id);
})
