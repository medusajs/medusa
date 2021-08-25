const { Customer } = require("@medusajs/medusa")

module.exports = {
  operationId: "GetCustomersCustomer",
  buildEndpoint: (id) => `/admin/customers/${id}`,
  setup: async (manager) => {
    const created = manager.create(Customer, {
      email: "test1@email.com",
    })

    await manager.save(created)
    return created.id
  },
  snapshotMatch: {
    customer: {
      id: expect.stringMatching(/^cus_*/),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  },
}
