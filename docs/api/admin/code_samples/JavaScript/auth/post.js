import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.admin.auth.createSession({
  email: 'user@example.com',
  password: 'supersecret'
}).then((({ user }) => {
  console.log(user.id);
});
