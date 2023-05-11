import { ProductTag } from "@models"
import { FilterQuery } from "@mikro-orm/core"

import { ProductTagListFilter } from "../types/product"
import { OptionsQuery } from "../types/dal/helpers"
import { RepositoryService } from "../types"

type InjectedDependencies = {
  productTagRepository: RepositoryService<ProductTag>
}

export default class ProductTagService {
  protected readonly productTagRepository_: RepositoryService<ProductTag>

  constructor({ productTagRepository }: InjectedDependencies) {
    this.productTagRepository_ = productTagRepository
  }

  async list(
    filters: ProductTagListFilter = {},
    config: { relations?: string[] } = {}
  ): Promise<ProductTag[]> {
    const where: FilterQuery<ProductTag> = {}

    const findOptions: OptionsQuery<ProductTag, any> & {
      populate: OptionsQuery<ProductTag, any>["populate"]
    } = {
      populate: config.relations ?? ([] as const),
    }

    if (filters.value) {
      where["value"] = { $ilike: filters.value }
    }

    // TODO: remove
    if (filters.id) {
      where["id"] = filters.id
    }

    return await this.productTagRepository_.find({
      where,
      options: findOptions,
    })
  }
}
