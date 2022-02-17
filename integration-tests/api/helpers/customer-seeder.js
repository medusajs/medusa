const { Customer, Address } = require("@medusajs/medusa")

module.exports = async (connection, data = {}) => {
  const manager = connection.manager

  const testAddr = await manager.create(Address, {
    id: "test-address",
    first_name: "Lebron",
    last_name: "James",
  })

  await manager.save(testAddr)

  const customer = await manager.create(Customer, {
    id: "test-customer-1",
    email: "test1@email.com",
  })

  customer.billing_address = testAddr
  customer.shipping_addresses = [testAddr]
  await manager.save(customer)

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
}
