import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.carts.deleteDiscount(cartId, code)
.then(({ cart }) => {
  console.log(cart.id);
})
