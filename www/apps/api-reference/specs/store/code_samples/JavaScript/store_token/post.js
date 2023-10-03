import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.store.auth.getToken({
  email: 'user@example.com',
  password: 'supersecret'
})
.then(({ accessToken }) => {
  console.log(accessToken);
});
