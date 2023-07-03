import { ProductTagService, ProductVariantService } from "@services"
import { Product } from "@models"
import {
  CreateProductDTO,
  DAL,
  FindConfig,
  ProductDTO,
  ProductTypes,
  SharedContext,
} from "@medusajs/types"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  productRepository: DAL.RepositoryService
  productVariantService: ProductVariantService
  productTagService: ProductTagService
}

export default class ProductService<TEntity = Product> {
  protected readonly productRepository_: DAL.RepositoryService<TEntity>

  constructor({ productRepository }: InjectedDependencies) {
    this.productRepository_ = productRepository
  }

  async list(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    sharedContext?: SharedContext
  ): Promise<TEntity[]> {
    if (filters.category_ids) {
      if (Array.isArray(filters.category_ids)) {
        filters.categories = {
          id: { $in: filters.category_ids },
        }
      } else {
        filters.categories = {
          id: filters.category_ids,
        }
      }
      delete filters.category_ids
    }

    const queryOptions = buildQuery<TEntity>(filters, config)
    return await this.productRepository_.find(queryOptions)
  }

  async listAndCount(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    sharedContext?: SharedContext
  ): Promise<[TEntity[], number]> {
    if (filters.category_ids) {
      if (Array.isArray(filters.category_ids)) {
        filters.categories = {
          id: { $in: filters.category_ids },
        }
      } else {
        filters.categories = {
          id: filters.category_ids,
        }
      }
      delete filters.category_ids
    }

    const queryOptions = buildQuery<TEntity>(filters, config)
    return await this.productRepository_.findAndCount(queryOptions)
  }

  async create(
    data: CreateProductDTO,
    sharedContext?: SharedContext
  ): Promise<ProductDTO> {
    if (!data.thumbnail && data.images.length) {
      data.thumbnail = data.images[0]
    }

    // TODO
    // Shipping profile is not part of the module
    // as well as sales channel

    this.productRepository_.create
  }
}
