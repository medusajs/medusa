import { ProductVariant } from "@models"
import { DALUtils } from "@medusajs/utils"

// eslint-disable-next-line max-len
export class ProductVariantRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  ProductVariant
) {}
