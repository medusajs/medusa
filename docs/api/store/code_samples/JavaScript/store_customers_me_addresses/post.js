import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged
medusa.customers.addresses.addAddress({
  address: {
    first_name: 'Celia',
    last_name: 'Schumm',
    address_1: '225 Bednar Curve',
    city: 'Danielville',
    country_code: 'US',
    postal_code: '85137',
    phone: '981-596-6748 x90188',
    company: 'Wyman LLC',
    address_2: '',
    province: 'Georgia',
    metadata: {}
  }
})
.then(({ customer }) => {
  console.log(customer.id);
});
