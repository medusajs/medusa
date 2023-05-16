import { ProductTagService, ProductVariantService } from "@services"
import { Product } from "@models"
import { FindOptions, RepositoryService } from "../types"
import { ProductListFilter } from "../types/product"
import { FilterQuery, OptionsQuery } from "../types/dal/helpers"
import { IProductService } from "@medusajs/types"

type InjectedDependencies = {
  productRepository: RepositoryService<Product>
  productVariantService: ProductVariantService
  productTagService: ProductTagService
}

export default class ProductService implements IProductService {
  protected readonly productRepository_: RepositoryService<Product>
  protected readonly productVariantService: ProductVariantService
  protected readonly productTagService: ProductTagService

  constructor({
    productRepository,
    productVariantService,
    productTagService,
  }: InjectedDependencies) {
    this.productRepository_ = productRepository
    this.productVariantService = productVariantService
    this.productTagService = productTagService
  }

  async list(
    filters: ProductListFilter = {},
    config: { relations?: string[] } = {}
  ): Promise<Product[]> {
    /**
     * Move the below manipulation in a new build query utils.
     * Needs more vision of what will be the end input shape of all api method
     */
    const where: FilterQuery<Product> = {}
    const findOptions: OptionsQuery<Product, any> & {
      populate: OptionsQuery<Product, any>["populate"]
    } = {
      populate: config.relations ?? ([] as const),
    }

    if (filters.tags?.length) {
      where["tags"] = { value: { $in: filters.tags } }
    }
    /**
     * End of manipulation
     */

    return await this.productRepository_.find({
      where,
      options: findOptions,
    } as FindOptions<Product>)
  }

  async listVariants() {
    return await this.productVariantService.list()
  }

  async listTags() {
    return await this.productTagService.list()
  }
}
