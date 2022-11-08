import { Connection } from "typeorm"
import { PublishableApiKey } from "@medusajs/medusa"

export type PublishableApiKeyData = {
  id?: string
  revoked_at?: Date
  revoked_by?: string
  created_by?: string
}

export const simplePublishableApiKeyFactory = async (
  connection: Connection,
  data: PublishableApiKeyData = {}
): Promise<PublishableApiKey> => {
  const manager = connection.manager

  const pubKey = manager.create(PublishableApiKey, data)

  return await manager.save(pubKey)
}
