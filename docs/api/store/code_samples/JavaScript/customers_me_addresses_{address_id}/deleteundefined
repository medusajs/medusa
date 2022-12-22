import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged
medusa.customers.addresses.deleteAddress(address_id)
.then(({ customer }) => {
  console.log(customer.id);
});
