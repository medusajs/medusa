import { Product } from "@models"
import {
  Context,
  DAL,
  FindConfig,
  ProductStatus,
  ProductTypes,
  WithRequiredProperty,
} from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { ProductRepository } from "@repositories"
import { doNotForceTransaction } from "../utils"

type InjectedDependencies = {
  productRepository: DAL.RepositoryService
}

export default class ProductService<TEntity extends Product = Product> {
  protected readonly productRepository_: DAL.RepositoryService

  constructor({ productRepository }: InjectedDependencies) {
    this.productRepository_ = productRepository
  }

  async retrieve(productId: string, sharedContext?: Context): Promise<TEntity> {
    const queryOptions = ModulesSdkUtils.buildQuery<Product>({
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

    return product[0] as TEntity
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

    const queryOptions = ModulesSdkUtils.buildQuery<Product>(filters, config)
    return (await this.productRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
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

    const queryOptions = ModulesSdkUtils.buildQuery<Product>(filters, config)
    return (await this.productRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager(doNotForceTransaction, "productRepository_")
  async create(
    data: ProductTypes.CreateProductOnlyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    data.forEach((product) => {
      product.status ??= ProductStatus.DRAFT
    })

    return (await (this.productRepository_ as ProductRepository).create(
      data as WithRequiredProperty<
        ProductTypes.CreateProductOnlyDTO,
        "status"
      >[],
      {
        transactionManager: sharedContext.transactionManager,
      }
    )) as TEntity[]
  }

  @InjectTransactionManager(doNotForceTransaction, "productRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productRepository_.delete(ids, {
      transactionManager: sharedContext.transactionManager,
    })
  }

  @InjectTransactionManager(doNotForceTransaction, "productRepository_")
  async softDelete(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productRepository_.softDelete(productIds, {
      transactionManager: sharedContext.transactionManager,
    })
  }

  @InjectTransactionManager(doNotForceTransaction, "productRepository_")
  async restore(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productRepository_.restore(productIds, {
      transactionManager: sharedContext.transactionManager,
    })
  }
}
