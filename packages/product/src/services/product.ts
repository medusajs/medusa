import { Product } from "@models"
import {
  Context,
  DAL,
  FindConfig,
  ProductStatus,
  ProductTypes,
} from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { MedusaError, ModuleUtils } from "@medusajs/utils"

type InjectedDependencies = {
  productRepository: DAL.RepositoryService
}

export default class ProductService<TEntity = Product> {
  protected readonly productRepository_: DAL.RepositoryService<TEntity>

  constructor({ productRepository }: InjectedDependencies) {
    this.productRepository_ = productRepository
  }

  async retrieve(productId: string, sharedContext?: Context): Promise<TEntity> {
    const queryOptions = ModuleUtils.buildQuery<TEntity>({
      id: productId,
    })
    const product = await this.productRepository_.find(
      queryOptions,
      sharedContext
    )

    if (!product?.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with id: ${productId} was not found`
      )
    }

    return product[0]
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

    const queryOptions = ModuleUtils.buildQuery<TEntity>(filters, config)
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

    const queryOptions = ModuleUtils.buildQuery<TEntity>(filters, config)
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

        manager_.persist(products)
        return products as unknown as TEntity[]
      },
      { transaction: sharedContext?.transactionManager }
    )
  }
}
