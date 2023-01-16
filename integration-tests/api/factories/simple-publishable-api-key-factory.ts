import faker from "faker"
import { Connection } from "typeorm"

import { PublishableApiKey } from "@medusajs/medusa"

export type PublishableApiKeyData = {
  id?: string
  revoked_at?: Date
  revoked_by?: string
  created_by?: string
  title?: string
}

export const simplePublishableApiKeyFactory = async (
  connection: Connection,
  data: PublishableApiKeyData = {}
): Promise<PublishableApiKey> => {
  const manager = connection.manager

  const pubKey = manager.create(PublishableApiKey, {
    ...data,
    title: data.title || `${faker.commerce.department()} API key`,
  })

  return await manager.save(pubKey)
}
