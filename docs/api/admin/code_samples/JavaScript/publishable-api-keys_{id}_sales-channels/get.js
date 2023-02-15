import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.publishableApiKeys.listSalesChannels()
  .then(({ sales_channels }) => {
    console.log(sales_channels.length)
  })
