import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token

// Total amount = 10000

// Example 1: Adding two new sessions
medusa.paymentCollections.managePaymentSessionsBatch(paymentId, {
  sessions: [
    {
      provider_id: "stripe",
      amount: 5000,
    },
    {
      provider_id: "manual",
      amount: 5000,
    },
  ]
})
.then(({ payment_collection }) => {
  console.log(payment_collection.id);
})

// Example 2: Updating one session and removing the other
medusa.paymentCollections.managePaymentSessionsBatch(paymentId, {
  sessions: [
    {
      provider_id: "stripe",
      amount: 10000,
      session_id: "ps_123456"
    },
  ]
})
.then(({ payment_collection }) => {
  console.log(payment_collection.id);
})
