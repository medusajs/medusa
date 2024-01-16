import { WithRequiredProperty } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { RequiredEntityData } from "@mikro-orm/core"
import { ProductVariantServiceTypes } from "../types/services"

// eslint-disable-next-line max-len
export class ProductVariantRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  ProductVariant,
  {
    create: RequiredEntityData<ProductVariant>
    update: WithRequiredProperty<
      ProductVariantServiceTypes.UpdateProductVariantDTO,
      "id"
    >
  }
>(ProductVariant) {}
