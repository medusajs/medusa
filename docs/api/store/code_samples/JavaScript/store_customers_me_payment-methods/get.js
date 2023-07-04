import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged
medusa.customers.paymentMethods.list()
.then(({ payment_methods }) => {
  console.log(payment_methods.length);
});
