import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.customers.create({
  email: 'user@example.com',
  first_name: 'Caterina',
  last_name: 'Yost',
  password: 'supersecret'
})
.then(({ customer }) => {
  console.log(customer.id);
});
