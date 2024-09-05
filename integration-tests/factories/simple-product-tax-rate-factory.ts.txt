import { DataSource } from "typeorm"
import faker from "faker"
import { ProductTaxRate, TaxRate } from "@medusajs/medusa"

type RateFactoryData = {
  region_id: string
  rate?: number | null
  code?: string
  name?: string
}

export type ProductTaxRateFactoryData = {
  product_id: string
  rate: RateFactoryData | string
}

export const simpleProductTaxRateFactory = async (
  dataSource: DataSource,
  data: ProductTaxRateFactoryData,
  seed?: number
): Promise<ProductTaxRate> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  let rateId: string
  if (typeof data.rate === "string") {
    rateId = data.rate
  } else {
    const newRate = manager.create(TaxRate, {
      region_id: data.rate.region_id,
      rate: data.rate.rate,
      code: data.rate.code || "sales_tax",
      name: data.rate.name || "Sales Tax",
    })
    const rate = await manager.save(newRate)
    rateId = rate.id
  }

  const toSave = manager.create(ProductTaxRate, {
    product_id: data.product_id,
    rate_id: rateId,
  })

  return await manager.save(toSave)
}
