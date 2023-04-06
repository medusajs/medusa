import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.returns.create({
  order_id,
  items: [
    {
      item_id,
      quantity: 1
    }
  ]
})
.then((data) => {
  console.log(data.return.id);
});
