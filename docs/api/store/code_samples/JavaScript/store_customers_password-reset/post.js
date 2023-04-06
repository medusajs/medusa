import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.customers.resetPassword({
  email: 'user@example.com',
  password: 'supersecret',
  token: 'supersecrettoken'
})
.then(({ customer }) => {
  console.log(customer.id);
});
