// TODO
const { Order, Region } = require("@medusajs/medusa")

module.exports = {
  operationId: "GetOrdersOrder",
  buildEndpoint: (id) => `/store/orders/${id}`,
  setup: async (manager, api) => {
    const region = manager.create(Region, {
      name: "Scandinavia",
      tax_rate: 0,
      currency_code: "dkk",
      countries: [{ iso_2: "dk" }, { iso_2: "se" }, { iso_2: "no" }],
      payment_providers: [{ id: "test-pay" }],
      fulfillment_providers: [{ id: "test-ful" }],
    })
    await manager.save(region)

    const customerRepsonse = await api.post("/store/customers", {
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ada@com.com",
      password: "test",
    })

    const order = manager.create(Order, {
      email: "ada@com.com",
      tax_rate: 0,
      region_id: region.id,
      customer_id: customerRepsonse.data.customer.id,
      currency_code: "dkk",
    })
    await manager.save(order)
    return order.id
  },
  snapshotMatch: {
      order: {
        id: expect.stringMatching(/^order_*/),
        created_at: expect.any(String),
        customer_id: expect.stringMatching(/^cus_*/), 
        region_id: expect.stringMatching(/^reg_*/), 
        customer: expect.objectContaining({
          id: expect.stringMatching(/^cus_*/), 
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }), 
        region: expect.objectContaining({
          id: expect.stringMatching(/^reg_*/), 
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      }
  },
}
