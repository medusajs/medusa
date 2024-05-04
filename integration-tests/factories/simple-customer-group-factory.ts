import { CustomerGroup } from "@medusajs/medusa"
import faker from "faker"
import { DataSource } from "typeorm"

export type CustomerGroupFactoryData = {
  id?: string
  name?: string
}

export const simpleCustomerGroupFactory = async (
  dataSource: DataSource,
  data: CustomerGroupFactoryData = {},
  seed?: number
): Promise<CustomerGroup> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  const customerGroupId =
    data.id || `simple-customer-group-${Math.random() * 1000}`
  const c = manager.create(CustomerGroup, {
    id: customerGroupId,
    name: data.name || faker.company.companyName(),
  })

  const group = await manager.save(c)

  return group
}
