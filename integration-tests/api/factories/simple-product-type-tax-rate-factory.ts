import { Connection } from "typeorm"
import faker from "faker"
import { ProductTypeTaxRate, TaxRate } from "@medusajs/medusa"

type RateFactoryData = {
  region_id: string
  rate?: number | null
  code?: string
  name?: string
}

export type ProductTypeTaxRateFactoryData = {
  product_type_id: string
  rate: RateFactoryData | string
}

export const simpleProductTypeTaxRateFactory = async (
  connection: Connection,
  data: ProductTypeTaxRateFactoryData,
  seed?: number
): Promise<ProductTypeTaxRate> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

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

  const toSave = manager.create(ProductTypeTaxRate, {
    product_type_id: data.product_type_id,
    rate_id: rateId,
  })

  return await manager.save(toSave)
}
