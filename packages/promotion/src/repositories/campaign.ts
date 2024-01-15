import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Campaign, Promotion } from "@models"
import { CreateCampaignDTO, UpdateCampaignDTO } from "@types"

export class CampaignRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Campaign,
  {
    create: CreateCampaignDTO
    update: UpdateCampaignDTO
  }
>(Campaign) {
  async create(
    data: CreateCampaignDTO[],
    context: Context = {}
  ): Promise<Campaign[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const promotionIds: string[] = []
    const campaignIdentifierPromotionsMap = new Map<string, string[]>()

    data.forEach((campaignData) => {
      const campaignPromotionIds =
        campaignData.promotions?.map((p) => p.id) || []

      promotionIds.push(...campaignPromotionIds)

      campaignIdentifierPromotionsMap.set(
        campaignData.campaign_identifier,
        promotionIds
      )

      delete campaignData.promotions
    })

    const existingPromotions = await manager.find(Promotion, {
      id: promotionIds,
    })

    const existingPromotionsMap = new Map<string, Promotion>(
      existingPromotions.map((promotion) => [promotion.id, promotion])
    )

    const createdCampaigns = await super.create(data, context)

    for (const createdCampaign of createdCampaigns) {
      const campaignPromotionIds =
        campaignIdentifierPromotionsMap.get(
          createdCampaign.campaign_identifier
        ) || []

      if (!campaignPromotionIds.length) {
        continue
      }

      for (const campaignPromotionId of campaignPromotionIds) {
        const promotion = existingPromotionsMap.get(campaignPromotionId)

        if (!promotion) {
          continue
        }

        createdCampaign.promotions.add(promotion)
      }
    }

    return createdCampaigns
  }

  async update(
    data: UpdateCampaignDTO[],
    context: Context = {}
  ): Promise<Campaign[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const promotionIds: string[] = []
    const campaignIds: string[] = []
    const campaignPromotionIdsMap = new Map<string, string[]>()

    data.forEach((campaignData) => {
      const campaignPromotionIds =
        campaignData.promotions?.map((p) => p.id) || []

      campaignIds.push(campaignData.id)
      promotionIds.push(...campaignPromotionIds)
      campaignPromotionIdsMap.set(campaignData.id, campaignPromotionIds)

      delete campaignData.promotions
    })

    const existingCampaigns = await manager.find(
      Campaign,
      { id: campaignIds },
      { populate: ["promotions"] }
    )

    const existingPromotions = await manager.find(Promotion, {
      id: promotionIds,
    })

    const existingCampaignsMap = new Map<string, Campaign>(
      existingCampaigns.map((campaign) => [campaign.id, campaign])
    )

    const existingPromotionsMap = new Map<string, Promotion>(
      existingPromotions.map((promotion) => [promotion.id, promotion])
    )

    const updatedCampaigns = await super.update(data, context)

    for (const updatedCampaign of updatedCampaigns) {
      const promotionIdsToAdd =
        campaignPromotionIdsMap.get(updatedCampaign.id) || []
      const existingPromotionIds = (
        existingCampaignsMap.get(updatedCampaign.id)?.promotions || []
      ).map((p) => p.id)

      for (const existingPromotionId of existingPromotionIds) {
        const promotion = existingPromotionsMap.get(existingPromotionId)

        if (!promotion) {
          continue
        }

        if (!promotionIdsToAdd.includes(existingPromotionId)) {
          updatedCampaign.promotions.remove(promotion)
        }
      }

      for (const promotionIdToAdd of promotionIdsToAdd) {
        const promotion = existingPromotionsMap.get(promotionIdToAdd)

        if (!promotion) {
          continue
        }

        if (existingPromotionIds.includes(promotionIdToAdd)) {
          continue
        } else {
          updatedCampaign.promotions.add(promotion)
        }
      }
    }

    return updatedCampaigns
  }
}
