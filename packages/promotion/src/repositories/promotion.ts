import { DALUtils } from "@medusajs/utils"
import { Promotion } from "@models"

export class PromotionRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  Promotion
) {}
