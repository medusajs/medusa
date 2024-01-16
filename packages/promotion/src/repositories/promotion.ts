import { DALUtils } from "@medusajs/utils"
import { Promotion } from "@models"
<<<<<<< HEAD
<<<<<<< HEAD
import { CreatePromotionDTO, UpdatePromotionDTO } from "@types"

export class PromotionRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Promotion,
  {
    create: CreatePromotionDTO
    Update: UpdatePromotionDTO
  }
>(Promotion) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
=======

export class PromotionRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  Promotion
) {}
>>>>>>> f04255619 (chore(utils, promotion): Attempt to abstract the modules repository)
=======
import { CreatePromotionDTO, UpdatePromotionDTO } from "@types"

export class PromotionRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Promotion,
  {
    create: CreatePromotionDTO
    Update: UpdatePromotionDTO
  }
>(Promotion) {}
>>>>>>> cff56d4e1 (Add dto typings)
