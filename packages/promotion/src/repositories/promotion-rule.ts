import { DALUtils } from "@medusajs/utils"
import { PromotionRule } from "@models"
<<<<<<< HEAD
<<<<<<< HEAD
import { CreatePromotionRuleDTO, UpdatePromotionRuleDTO } from "@types"

export class PromotionRuleRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PromotionRule,
  {
    create: CreatePromotionRuleDTO
    update: UpdatePromotionRuleDTO
  }
>(PromotionRule) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
=======

export class PromotionRuleRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  PromotionRule
) {}
>>>>>>> f04255619 (chore(utils, promotion): Attempt to abstract the modules repository)
=======
import { CreatePromotionRuleDTO, UpdatePromotionRuleDTO } from "@types"

export class PromotionRuleRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PromotionRule,
  {
    create: CreatePromotionRuleDTO
    update: UpdatePromotionRuleDTO
  }
>(PromotionRule) {}
>>>>>>> cff56d4e1 (Add dto typings)
