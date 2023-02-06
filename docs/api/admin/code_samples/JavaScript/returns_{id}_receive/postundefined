import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.returns.receive(return_id, {
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
