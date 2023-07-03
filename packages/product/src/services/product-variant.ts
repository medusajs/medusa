import { ProductVariant } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { ModuleUtils } from "@medusajs/utils"

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
    sharedContext?: Context
  ): Promise<TEntity[]> {
    const queryOptions = ModuleUtils.buildQuery<TEntity>(filters, config)
    return await this.productVariantRepository_.find(
      queryOptions,
      sharedContext
    )
  }
}
