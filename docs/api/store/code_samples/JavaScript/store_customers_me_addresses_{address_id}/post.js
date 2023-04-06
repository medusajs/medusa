import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged
medusa.customers.addresses.updateAddress(address_id, {
  first_name: 'Gina'
})
.then(({ customer }) => {
  console.log(customer.id);
});
