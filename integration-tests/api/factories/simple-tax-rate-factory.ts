import { DataSource } from "typeorm"
import faker from "faker"
import { TaxRate } from "@medusajs/medusa"

export type TaxRateFactoryData = {
  region_id: string
  rate?: number | null
  code?: string
  name?: string
}

export const simpleTaxRateFactory = async (
  dataSource: DataSource,
  data: TaxRateFactoryData,
  seed?: number
): Promise<TaxRate> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  const toSave = manager.create(TaxRate, {
    region_id: data.region_id,
    rate:
      data.rate ?? faker.datatype.number({ min: 0, max: 100, precision: 2 }),
    code: data.code || faker.random.word(),
    name: data.name || faker.random.words(2),
  })

  return await manager.save(toSave)
}
