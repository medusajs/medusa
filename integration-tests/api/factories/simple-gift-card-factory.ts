import { GiftCard } from "@medusajs/medusa"
import faker from "faker"
import { Connection } from "typeorm"

export type GiftCardFactoryData = {
  id?: string
  code?: string
  region_id: string
  value: number
  balance: number
}

export const simpleGiftCardFactory = async (
  connection: Connection,
  data: GiftCardFactoryData,
  seed?: number
): Promise<GiftCard> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

  const toSave = manager.create(GiftCard, {
    id: data.id,
    code: data.code ?? "TESTGCCODE",
    region_id: data.region_id,
    value: data.value,
    balance: data.balance,
  })

  return await manager.save(toSave)
}
