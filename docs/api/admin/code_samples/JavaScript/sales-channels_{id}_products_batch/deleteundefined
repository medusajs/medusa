import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.salesChannels.removeProducts(sales_channel_id, {
  product_ids: [
    {
      id: product_id
    }
  ]
})
.then(({ sales_channel }) => {
  console.log(sales_channel.id);
});
