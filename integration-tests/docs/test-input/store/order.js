// TODO
const { Order } = require("@medusajs/medusa")

module.exports = {
  operationId: "GetOrdersOrder",
  buildEndpoint: (id) => `/store/orders/${id}`,
  setup: async (manager) => {
    const order = manager.create(Order, {
      name: "Scandinavia",
      tax_rate: 0,
      currency_code: "dkk",
      countries: [{ iso_2: "dk" }, { iso_2: "se" }, { iso_2: "no" }],
      payment_providers: [{ id: "test-pay" }],
      fulfillment_providers: [{ id: "test-ful" }],
    })
    await manager.save(order)
    return order.id
  },
  snapshotMatch: {
      order: {}
      //   {
      //     id: expect.stringMatching(/^reg_*/),
      //     created_at: expect.any(String),
      //     updated_at: expect.any(String),
      //     name:expect.any(String),
      //   }
  },
}
