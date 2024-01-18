import { CreatePromotionDTO } from "@medusajs/types"
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
