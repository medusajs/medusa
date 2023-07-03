import { ProductTagService, ProductVariantService } from "@services"
import { Product } from "@models"
import {
  Context,
  DAL,
  FindConfig,
  ProductStatus,
  ProductTypes,
} from "@medusajs/types"
import { buildQuery } from "../utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"

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
    sharedContext?: Context
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
    return await this.productRepository_.find(queryOptions, sharedContext)
  }

  async listAndCount(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    sharedContext?: Context
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
    return await this.productRepository_.findAndCount(
      queryOptions,
      sharedContext
    )
  }

  async create(
    data: ProductTypes.CreateProductOnlyDTO[],
    sharedContext?: Context
  ): Promise<TEntity[]> {
    return await this.productRepository_.transaction(
      async (manager) => {
        const manager_ = manager as SqlEntityManager
        const products: Product[] = []
        data.forEach((product) => {
          product.status ??= ProductStatus.DRAFT
          products.push(manager_.create(Product, product as unknown as Product))
        })

        await manager_.persistAndFlush(products)
        return products as unknown as TEntity[]
      },
      { transaction: sharedContext?.transactionManager }
    )
  }
}
