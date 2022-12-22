import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.customerGroups.listCustomers(customer_group_id)
.then(({ customers }) => {
  console.log(customers.length);
});
