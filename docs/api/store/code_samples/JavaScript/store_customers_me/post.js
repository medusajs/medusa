import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged
medusa.customers.update({
  first_name: 'Laury'
})
.then(({ customer }) => {
  console.log(customer.id);
});
