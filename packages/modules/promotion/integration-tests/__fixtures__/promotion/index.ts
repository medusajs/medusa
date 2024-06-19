import {
  CreatePromotionDTO,
  IPromotionModuleService,
  PromotionDTO,
} from "@medusajs/types"
import { isPresent } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Promotion } from "@models"
import { defaultPromotionsData } from "./data"

export * from "./data"

export async function createPromotions(
  manager: SqlEntityManager,
  promotionsData: CreatePromotionDTO[] = defaultPromotionsData
): Promise<Promotion[]> {
  const promotions: Promotion[] = []

  for (let promotionData of promotionsData) {
    let promotion = manager.create(Promotion, promotionData)

    manager.persist(promotion)
    await manager.flush()
    promotions.push(promotion)
  }

  return promotions
}

export async function createDefaultPromotions(
  service: IPromotionModuleService,
  promotionsData: Partial<CreatePromotionDTO>[] = defaultPromotionsData
): Promise<Promotion[]> {
  const promotions: Promotion[] = []

  for (let promotionData of promotionsData) {
    let promotion = await createDefaultPromotion(service, promotionData)

    promotions.push(promotion)
  }

  return promotions
}

export async function createDefaultPromotion(
  service: IPromotionModuleService,
  data: Partial<CreatePromotionDTO>
): Promise<PromotionDTO> {
  const { application_method = {}, campaign = {}, ...promotion } = data

  return await service.createPromotions({
    code: "PROMOTION_TEST",
    type: "standard",
    campaign_id: "campaign-id-1",
    ...promotion,
    application_method: {
      currency_code: "USD",
      target_type: "items",
      type: "fixed",
      allocation: "across",
      value: 1000,
      ...application_method,
    },
    campaign: isPresent(campaign)
      ? {
          campaign_identifier: "campaign-identifier",
          name: "new campaign",
          ...campaign,
        }
      : undefined,
  })
}
