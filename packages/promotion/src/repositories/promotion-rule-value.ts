import { DALUtils } from "@medusajs/utils"
import { PromotionRuleValue } from "@models"
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> cff56d4e1 (Add dto typings)
import {
  CreatePromotionRuleValueDTO,
  UpdatePromotionRuleValueDTO,
} from "@types"
<<<<<<< HEAD

export class PromotionRuleValueRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PromotionRuleValue,
  {
    create: CreatePromotionRuleValueDTO
    update: UpdatePromotionRuleValueDTO
  }
>(PromotionRuleValue) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
=======

export class PromotionRuleValueRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  PromotionRuleValue
) {}
>>>>>>> f04255619 (chore(utils, promotion): Attempt to abstract the modules repository)
=======

export class PromotionRuleValueRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PromotionRuleValue,
  {
    create: CreatePromotionRuleValueDTO
    update: UpdatePromotionRuleValueDTO
  }
>(PromotionRuleValue) {}
>>>>>>> cff56d4e1 (Add dto typings)
