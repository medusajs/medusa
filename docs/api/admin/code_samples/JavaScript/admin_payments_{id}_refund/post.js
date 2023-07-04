import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.payments.refundPayment(payment_id, {
  amount: 1000,
  reason: 'return',
  note: 'Do not like it',
})
.then(({ payment }) => {
  console.log(payment.id);
});
