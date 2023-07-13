import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.swaps.retrieveByCartId(cart_id)
.then(({ swap }) => {
  console.log(swap.id);
});
