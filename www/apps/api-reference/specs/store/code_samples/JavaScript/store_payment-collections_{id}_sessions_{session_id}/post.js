import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.paymentCollections.refreshPaymentSession(paymentCollectionId, sessionId)
.then(({ payment_session }) => {
  console.log(payment_session.id);
})
