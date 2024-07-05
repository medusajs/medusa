import { SalesChannel } from "@models"
import { RequiredEntityData } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export async function createSalesChannels(
  manager: SqlEntityManager,
  data: RequiredEntityData<SalesChannel>[]
) {
  const channels = data.map((channel) => {
    return manager.create(SalesChannel, channel)
  })

  await manager.persistAndFlush(channels)

  return channels
}
