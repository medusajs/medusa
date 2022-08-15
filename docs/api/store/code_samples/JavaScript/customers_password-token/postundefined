import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.customers.generatePasswordToken({
  email: 'user@example.com'
})
.then(() => {
  // successful
})
.catch(() => {
  // failed
})
