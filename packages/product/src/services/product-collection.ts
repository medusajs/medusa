import { ProductCollection } from "@models"
import { FilterQuery } from "@mikro-orm/core"

import { ProductCollectionListFilter } from "../types/product"
import { OptionsQuery } from "../types/dal/helpers"
import { RepositoryService } from "../types"

type InjectedDependencies = {
  productCollectionRepository: RepositoryService<ProductCollection>
}

export default class ProductCollectionService {
  protected readonly productCollectionRepository_: RepositoryService<ProductCollection>

  constructor({ productCollectionRepository }: InjectedDependencies) {
    this.productCollectionRepository_ = productCollectionRepository
  }

  async list(
    filters: ProductCollectionListFilter = {},
    config: { relations?: string[] } = {}
  ): Promise<ProductCollection[]> {
    const where: FilterQuery<ProductCollection> = {}

    const findOptions: OptionsQuery<ProductCollection, any> & {
      populate: OptionsQuery<ProductCollection, any>["populate"]
    } = {
      populate: config.relations ?? ([] as const),
    }

    if (filters.title) {
      where["title"] = { $like: filters.title }
    }

    // TODO: remove
    if (filters.id) {
      where["id"] = filters.id
    }

    return await this.productCollectionRepository_.find({
      where,
      options: findOptions,
    })
  }
}
