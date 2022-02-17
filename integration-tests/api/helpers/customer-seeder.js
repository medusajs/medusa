const { Customer, Address, CustomerGroup } = require("@medusajs/medusa")

module.exports = async (connection, data = {}) => {
  const manager = connection.manager

  await manager.insert(Customer, {
    id: "test-customer-1",
    email: "test1@email.com",
  })

  await manager.insert(Customer, {
    id: "test-customer-2",
    email: "test2@email.com",
  })

  await manager.insert(Customer, {
    id: "test-customer-3",
    email: "test3@email.com",
  })

  await manager.insert(Customer, {
    id: "test-customer-has_account",
    email: "test4@email.com",
    has_account: true,
  })

  await manager.insert(CustomerGroup, {
    id: "test-group-0",
    name: "vip-customers",
  })

  await manager.insert(Address, {
    id: "test-address",
    first_name: "Lebron",
    last_name: "James",
    customer_id: "test-customer-1",
  })
}
