import { ProductVariant } from "@models"
import { RepositoryService } from "../types"
import { FindConfig, ProductTypes, SharedContext } from "@medusajs/types"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  productVariantRepository: RepositoryService<ProductVariant>
}

export default class ProductVariantService {
  protected readonly productVariantRepository_: RepositoryService<ProductVariant>

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
