import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.orders.confirmRequest(
  token,
)
.then(() => {
  // successful
})
.catch(() => {
  // an error occurred
});
