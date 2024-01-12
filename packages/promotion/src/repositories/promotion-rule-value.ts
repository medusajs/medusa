import { DALUtils } from "@medusajs/utils"
import { PromotionRuleValue } from "@models"
import {
  CreatePromotionRuleValueDTO,
  UpdatePromotionRuleValueDTO,
} from "@types"

export class PromotionRuleValueRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PromotionRuleValue,
  {
    create: CreatePromotionRuleValueDTO
    update: UpdatePromotionRuleValueDTO
  }
>(PromotionRuleValue) {
  // @ts-ignore
  constructor(...arguments: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
