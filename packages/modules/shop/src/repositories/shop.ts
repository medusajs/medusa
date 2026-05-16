import { DALUtils } from "@medusajs/framework/utils"

export class ShopRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "Shop"
) {}
