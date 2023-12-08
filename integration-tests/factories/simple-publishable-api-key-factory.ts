import faker from "faker"
import { DataSource } from "typeorm"

import { PublishableApiKey } from "@medusajs/medusa"

export type PublishableApiKeyData = {
  id?: string
  revoked_at?: Date
  revoked_by?: string
  created_by?: string
  title?: string
}

export const simplePublishableApiKeyFactory = async (
  dataSource: DataSource,
  data: PublishableApiKeyData = {}
): Promise<PublishableApiKey> => {
  const manager = dataSource.manager

  const pubKey = manager.create(PublishableApiKey, {
    ...data,
    title: data.title || `${faker.commerce.department()} API key`,
  })

  return await manager.save(pubKey)
}
