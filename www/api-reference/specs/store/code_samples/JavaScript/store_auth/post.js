import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.auth.authenticate({
  email: 'user@example.com',
  password: 'user@example.com'
})
.then(({ customer }) => {
  console.log(customer.id);
});
