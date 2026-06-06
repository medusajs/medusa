import { CreateCampaignDTO } from "@zjedene-medusa/framework/types"
import { toMikroORMEntity } from "@zjedene-medusa/framework/utils"
import { SqlEntityManager } from "@zjedene-medusa/framework/mikro-orm/postgresql"
import { Campaign } from "@models"
import { defaultCampaignsData } from "./data"

export * from "./data"

const TODAY = new Date()
export async function createCampaigns(
  manager: SqlEntityManager,
  campaignsData?: CreateCampaignDTO[]
): Promise<Campaign[]> {
  if (!campaignsData) {
    const cp = structuredClone(defaultCampaignsData)

    const starts_at = new Date(TODAY)
    starts_at.setDate(starts_at.getDate() - 1)
    starts_at.setMonth(starts_at.getMonth() - 1)

    const ends_at = new Date(TODAY)
    ends_at.setDate(ends_at.getDate() - 1)
    ends_at.setMonth(ends_at.getMonth() - 1)
    ends_at.setFullYear(ends_at.getFullYear() + 1)

    for (const data of cp) {
      data.starts_at = starts_at
      data.ends_at = ends_at
    }

    campaignsData = cp
  }
  const campaigns: Campaign[] = []

  for (let campaignData of campaignsData) {
    let campaign = manager.create(toMikroORMEntity(Campaign), campaignData)

    manager.persist(campaign)

    await manager.flush()
  }

  return campaigns
}
