import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.orderEdits.removeLineItem(order_edit_id, line_item_id)
  .then(({ order_edit }) => {
    console.log(order_edit.id)
  })
