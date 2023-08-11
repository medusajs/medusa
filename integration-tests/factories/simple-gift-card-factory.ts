import { GiftCard } from "@medusajs/medusa"
import faker from "faker"
import { DataSource } from "typeorm"

export type GiftCardFactoryData = {
  id?: string
  code?: string
  region_id: string
  value: number
  balance: number
  tax_rate?: number
}

export const simpleGiftCardFactory = async (
  dataSource: DataSource,
  data: GiftCardFactoryData,
  seed?: number
): Promise<GiftCard> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  const toSave = manager.create(GiftCard, {
    id: data.id,
    code: data.code ?? "TESTGCCODE",
    region_id: data.region_id,
    value: data.value,
    balance: data.balance,
    tax_rate: data.tax_rate,
  })

  return await manager.save(toSave)
}
