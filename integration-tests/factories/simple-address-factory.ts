import { DataSource } from "typeorm"
import faker from "faker"
import { Address } from "@medusajs/medusa"

export type AddressFactoryData = {
  first_name?: string
  last_name?: string
  country_code?: string
  address_1?: string
  postal_code?: string
}

export const simpleAddressFactory = async (
  dataSource: DataSource,
  data: AddressFactoryData = {},
  seed?: number
): Promise<Address> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  const address = manager.create(Address, {
    id: `simple-id-${Math.random() * 1000}`,
    first_name: data.first_name || faker.name.firstName(),
    last_name: data.last_name || faker.name.lastName(),
    country_code: data.country_code || "us",
    address_1: data.address_1 || faker.address.streetAddress(),
    postal_code: data.postal_code || faker.address.zipCode(),
  })

  return await manager.save(address)
}
