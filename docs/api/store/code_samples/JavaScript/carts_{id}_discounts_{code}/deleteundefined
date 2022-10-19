import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.carts.deleteDiscount(cart_id, code)
.then(({ cart }) => {
  console.log(cart.id);
});
