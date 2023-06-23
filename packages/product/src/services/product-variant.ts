import { ProductVariant } from "@models"
import { DAL, FindConfig, ProductTypes, SharedContext } from "@medusajs/types"
import { DalUtils } from "@medusajs/utils"

type InjectedDependencies = {
  productVariantRepository: DAL.RepositoryService
}

export default class ProductVariantService<TEntity = ProductVariant> {
  protected readonly productVariantRepository_: DAL.RepositoryService<TEntity>

  constructor({ productVariantRepository }: InjectedDependencies) {
    this.productVariantRepository_ = productVariantRepository
  }

  async list(
    filters: ProductTypes.FilterableProductVariantProps = {},
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    sharedContext?: SharedContext
  ): Promise<TEntity[]> {
    const queryOptions = DalUtils.buildQuery<TEntity>(filters, config)
    return await this.productVariantRepository_.find(queryOptions)
  }
}
