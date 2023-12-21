import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Promotion } from "@models"
import { defaultPromotionsData } from "./data"

export * from "./data"

export async function createPromotions(
  manager: SqlEntityManager,
  promotionsData = defaultPromotionsData
): Promise<Promotion[]> {
  const promotion: Promotion[] = []

  for (let promotionData of promotionsData) {
    let promotion = manager.create(Promotion, promotionData)

    manager.persist(promotion)

    await manager.flush()
  }

  return promotion
}
