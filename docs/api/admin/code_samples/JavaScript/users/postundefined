import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.users.create({
  email: 'user@example.com',
  password: 'supersecret'
})
.then(({ user }) => {
  console.log(user.id);
});
