import { ProductTag, ProductVariant } from "@models"
import { RepositoryService } from "../types"
import {
  FilterableProductVariantProps,
  FindConfig,
  ProductVariantDTO,
  SharedContext,
} from "@medusajs/types"
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
    filters: FilterableProductVariantProps = {},
    config: FindConfig<ProductVariantDTO> = {},
    sharedContext?: SharedContext
  ): Promise<ProductVariant[]> {
    const where: FilterQuery<ProductVariant> = {
      ...filters,
    }

    const findOptions: OptionsQuery<ProductTag, any> & {
      populate: OptionsQuery<ProductTag, any>["populate"]
    } = {
      populate: config.relations ?? ([] as const),
    }

    return await this.productVariantRepository_.find({
      where,
      options: findOptions,
    })
  }
}
