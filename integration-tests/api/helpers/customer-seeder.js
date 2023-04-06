const { Customer, Address, CustomerGroup } = require("@medusajs/medusa")

module.exports = async (dataSource, data = {}) => {
  const manager = dataSource.manager

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

  const customer5 = await manager.create(Customer, {
    id: "test-customer-5",
    email: "test5@email.com",
  })
  await manager.save(customer5)

  const customer6 = await manager.create(Customer, {
    id: "test-customer-6",
    email: "test6@email.com",
  })
  await manager.save(customer6)

  const customer7 = await manager.create(Customer, {
    id: "test-customer-7",
    email: "test7@email.com",
  })
  await manager.save(customer7)

  const deletionCustomer = await manager.create(Customer, {
    id: "test-customer-delete-cg",
    email: "test-deletetion-cg@email.com",
  })
  await manager.save(deletionCustomer)

  await manager.insert(CustomerGroup, {
    id: "customer-group-1",
    name: "vip-customers",
  })

  await manager.insert(CustomerGroup, {
    id: "customer-group-2",
    name: "test-group-2",
    metadata: { data1: "value1" },
  })

  await manager.insert(CustomerGroup, {
    id: "customer-group-3",
    name: "test-group-3",
  })

  await manager.insert(CustomerGroup, {
    id: "test-group-4",
    name: "test-group-4",
  })

  const c_group_5 = await manager.create(CustomerGroup, {
    id: "test-group-5",
    name: "test-group-5",
  })
  await manager.save(c_group_5)

  const c_group_6 = await manager.create(CustomerGroup, {
    id: "test-group-6",
    name: "test-group-6",
  })
  await manager.save(c_group_6)

  customer5.groups = [c_group_5]
  await manager.save(customer5)

  customer6.groups = [c_group_5]
  await manager.save(customer6)

  customer7.groups = [c_group_5, c_group_6]
  await manager.save(customer7)

  const c_group_delete = await manager.create(CustomerGroup, {
    id: "test-group-delete",
    name: "test-group-delete",
  })
  await manager.save(c_group_delete)

  deletionCustomer.groups = [c_group_delete]
  await manager.save(deletionCustomer)
}
