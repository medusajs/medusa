import { ProductTag, ProductVariant } from "@models"
import { RepositoryService } from "../types"
import { FindConfig, ProductTypes, SharedContext } from "@medusajs/types"
import { FilterQuery } from "@mikro-orm/core"
import { OptionsQuery } from "../types/dal/helpers"

type InjectedDependencies = {
  productVariantRepository: RepositoryService<ProductVariant>
}

export default class ProductVariantService {
  protected readonly productVariantRepository_: RepositoryService<ProductVariant>

  constructor({ productVariantRepository }: InjectedDependencies) {
    this.productVariantRepository_ = productVariantRepository
  }

  async list(
    filters: ProductTypes.FilterableProductVariantProps = {},
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    sharedContext?: SharedContext
  ): Promise<ProductVariant[]> {
    const where: FilterQuery<ProductVariant> = {
      ...filters,
    }

    const findOptions: OptionsQuery<ProductTag, any> & {
      populate: OptionsQuery<ProductTag, any>["populate"]
    } = {
      populate: config.relations ?? ([] as const),
      fields: config.select,
      limit: config.take,
      offset: config.skip,
    }

    return await this.productVariantRepository_.find({
      where,
      options: findOptions,
    })
  }
}
