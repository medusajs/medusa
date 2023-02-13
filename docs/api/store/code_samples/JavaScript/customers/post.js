import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.customers.create({
  first_name: 'Alec',
  last_name: 'Reynolds',
  email: 'user@example.com',
  password: 'supersecret'
})
.then(({ customer }) => {
  console.log(customer.id);
});
