import { DALUtils } from "@medusajs/framework/utils"

export class BrandRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  "Brand"
) {}
