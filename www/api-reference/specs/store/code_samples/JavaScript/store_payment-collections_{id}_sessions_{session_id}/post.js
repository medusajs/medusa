import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.paymentCollections.refreshPaymentSession(payment_collection_id, session_id)
.then(({ payment_session }) => {
  console.log(payment_session.id);
});
