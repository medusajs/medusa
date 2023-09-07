import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.orderEdits.list()
  .then(({ order_edits, count, limit, offset }) => {
    console.log(order_edits.length)
  })
