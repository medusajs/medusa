import faker from "faker"
import { DataSource } from "typeorm"
import { Customer, CustomerGroup } from "@medusajs/medusa"
import { CustomerGroupFactoryData, simpleCustomerGroupFactory, } from "./simple-customer-group-factory"

export type CustomerFactoryData = {
  id?: string
  email?: string
  phone?: string
  first_name?: string
  last_name?: string
  groups?: CustomerGroupFactoryData[]
  password_hash?: string
  has_account?: boolean
}

export const simpleCustomerFactory = async (
  dataSource: DataSource,
  data: CustomerFactoryData = {},
  seed?: number
): Promise<Customer> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  const customerId = data.id || `simple-customer-${Math.random() * 1000}`
  const c = manager.create(Customer, {
    id: customerId,
    email: data.email ?? faker.internet.email(),
    phone: data.phone ?? faker.phone.phoneNumber(),
    first_name: data.first_name ?? faker.name.firstName(),
    last_name: data.last_name ?? faker.name.lastName(),
    password_hash:
      data.password_hash ??
      "c2NyeXB0AAEAAAABAAAAAVMdaddoGjwU1TafDLLlBKnOTQga7P2dbrfgf3fB+rCD/cJOMuGzAvRdKutbYkVpuJWTU39P7OpuWNkUVoEETOVLMJafbI8qs8Qx/7jMQXkN", // password matching "test"
    has_account: data.has_account ?? true,
  })

  if (data.password_hash) {
    c.password_hash = data.password_hash
    c.has_account = true
  }

  const customer = await manager.save(c)

  if (data.groups) {
    const groups: CustomerGroup[] = []
    for (const g of data.groups) {
      const created = await simpleCustomerGroupFactory(dataSource, g)
      groups.push(created)
    }

    customer.groups = groups
    await manager.save(customer)
  }

  return customer
}
