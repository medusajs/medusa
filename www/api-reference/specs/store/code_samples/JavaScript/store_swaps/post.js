import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.swaps.create({
  order_id,
  return_items: [
    {
      item_id,
      quantity: 1
    }
  ],
  additional_items: [
    {
      variant_id,
      quantity: 1
    }
  ]
})
.then(({ swap }) => {
  console.log(swap.id);
});
