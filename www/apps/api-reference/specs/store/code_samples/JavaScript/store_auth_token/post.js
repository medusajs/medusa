import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.auth.getToken({
  email: 'user@example.com',
  password: 'supersecret'
})
.then(({ access_token }) => {
  console.log(access_token);
})
