import { SqlEntityManager } from "@mikro-orm/postgresql"
import { SalesChannel } from "@models"

const salesChannelData = [
  {
    id: "channel-1",
    name: "Channel 1",
    description: "Channel description 1",
    is_disabled: false,
  },
  {
    id: "channel-2",
    name: "Channel 2",
    description: "Channel description 2",
    is_disabled: false,
  },
  {
    id: "channel-3",
    name: "Channel 3",
    description: "Channel description 3",
    is_disabled: true,
  },
]

export async function createSalesChannels(
  manager: SqlEntityManager,
  channelData: any[] = salesChannelData
): Promise<SalesChannel[]> {
  const channels: SalesChannel[] = []

  for (let data of channelData) {
    const sc = manager.create(SalesChannel, data)

    channels.push(sc)
  }

  await manager.persistAndFlush(channels)

  return channels
}
