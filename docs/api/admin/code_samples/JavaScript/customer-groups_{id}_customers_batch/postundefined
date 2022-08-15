import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.customerGroups.addCustomers(customer_group_id, {
  customer_ids: [
    {
      id: customer_id
    }
  ]
})
.then(({ customer_group }) => {
  console.log(customer_group.id);
});
