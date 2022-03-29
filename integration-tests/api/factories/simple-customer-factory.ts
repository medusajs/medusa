import { Customer } from "@medusajs/medusa"
import faker from "faker"
import { Connection } from "typeorm"
import {
  CustomerGroupFactoryData,
  simpleCustomerGroupFactory,
} from "./simple-customer-group-factory"

export type CustomerFactoryData = {
  id?: string
  email?: string
  groups?: CustomerGroupFactoryData[]
}

export const simpleCustomerFactory = async (
  connection: Connection,
  data: CustomerFactoryData = {},
  seed?: number
): Promise<Customer> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

  const customerId = data.id || `simple-customer-${Math.random() * 1000}`
  const c = manager.create(Customer, {
    id: customerId,
    email: data.email,
  })

  const customer = await manager.save(c)

  if (data.groups) {
    const groups = []
    for (const g of data.groups) {
      const created = await simpleCustomerGroupFactory(connection, g)
      groups.push(created)
    }

    customer.groups = groups
    await manager.save(customer)
  }

  return customer
}
