import { ProductVariant } from "@models"
import { DAL, FindConfig, ProductTypes, SharedContext } from "@medusajs/types"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  productVariantRepository: DAL.RepositoryService<ProductVariant>
}

export default class ProductVariantService {
  protected readonly productVariantRepository_: DAL.RepositoryService<ProductVariant>

  constructor({ productVariantRepository }: InjectedDependencies) {
    this.productVariantRepository_ = productVariantRepository
  }

  async list<T = ProductVariant>(
    filters: ProductTypes.FilterableProductVariantProps = {},
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    sharedContext?: SharedContext
  ): Promise<T[]> {
    const queryOptions = buildQuery<T>(filters, config)
    return await this.productVariantRepository_.find<T>(queryOptions)
  }
}
