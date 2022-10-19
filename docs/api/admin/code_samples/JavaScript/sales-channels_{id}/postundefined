import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.salesChannels.update(sales_channel_id, {
  name: 'App'
})
.then(({ sales_channel }) => {
  console.log(sales_channel.id);
});
