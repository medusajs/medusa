import { DALUtils } from "@medusajs/utils"
import { Promotion } from "@models"
import { CreatePromotionDTO, UpdatePromotionDTO } from "@types"

export class PromotionRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Promotion,
  {
    create: CreatePromotionDTO
    Update: UpdatePromotionDTO
  }
>(Promotion) {
  // @ts-ignore
  constructor(...arguments: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
