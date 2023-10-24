import { Modules } from "@medusajs/modules-sdk"
import {
  Context,
  DAL,
  FindConfig,
  ProductTypes,
  WithRequiredProperty,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  ProductUtils,
  composeMessage,
  isDefined,
} from "@medusajs/utils"
import { Product } from "@models"
import { ProductRepository } from "@repositories"
import { InternalContext, ProductEvents } from "../types"
import { ProductServiceTypes } from "../types/services"
import { doNotForceTransaction } from "../utils"

type InjectedDependencies = {
  productRepository: DAL.RepositoryService
}

export default class ProductService<TEntity extends Product = Product> {
  protected readonly productRepository_: DAL.RepositoryService

  constructor({ productRepository }: InjectedDependencies) {
    this.productRepository_ = productRepository
  }

  @InjectManager("productRepository_")
  async retrieve(
    productId: string,
    config: FindConfig<ProductTypes.ProductDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    if (!isDefined(productId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"productId" must be defined`
      )
    }

    const queryOptions = ModulesSdkUtils.buildQuery<Product>(
      {
        id: productId,
      },
      config
    )

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

  @InjectManager("productRepository_")
  async list(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    if (filters.category_id) {
      if (Array.isArray(filters.category_id)) {
        filters.categories = {
          id: { $in: filters.category_id },
        }
      } else {
        filters.categories = {
          id: filters.category_id,
        }
      }
      delete filters.category_id
    }

    const queryOptions = ModulesSdkUtils.buildQuery<Product>(filters, config)
    return (await this.productRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("productRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    if (filters.category_id) {
      if (Array.isArray(filters.category_id)) {
        filters.categories = {
          id: { $in: filters.category_id },
        }
      } else {
        filters.categories = {
          id: filters.category_id,
        }
      }
      delete filters.category_id
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
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    data.forEach((product) => {
      product.status ??= ProductUtils.ProductStatus.DRAFT
    })

    const products = await (
      this.productRepository_ as ProductRepository
    ).create(
      data as WithRequiredProperty<
        ProductTypes.CreateProductOnlyDTO,
        "status"
      >[],
      {
        transactionManager: sharedContext.transactionManager,
      }
    )

    sharedContext.messageAggregator?.save(
      products.map(({ id }) => {
        return composeMessage(ProductEvents.PRODUCT_CREATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: Product.name,
          context: sharedContext,
        })
      })
    )

    return products as TEntity[]
  }

  @InjectTransactionManager(doNotForceTransaction, "productRepository_")
  async update(
    data: ProductServiceTypes.UpdateProductDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    const products = await (
      this.productRepository_ as ProductRepository
    ).update(
      data as WithRequiredProperty<
        ProductServiceTypes.UpdateProductDTO,
        "id"
      >[],
      {
        transactionManager: sharedContext.transactionManager,
      }
    )

    sharedContext.messageAggregator?.save(
      products.map(({ id }) => {
        return composeMessage(ProductEvents.PRODUCT_UPDATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: Product.name,
          context: sharedContext,
        })
      })
    )

    return products as TEntity[]
  }

  @InjectTransactionManager(doNotForceTransaction, "productRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<void> {
    await this.productRepository_.delete(ids, {
      transactionManager: sharedContext.transactionManager,
    })

    sharedContext.messageAggregator?.save(
      ids.map((id) => {
        return composeMessage(ProductEvents.PRODUCT_DELETED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: Product.name,
          context: sharedContext,
        })
      })
    )
  }

  @InjectTransactionManager(doNotForceTransaction, "productRepository_")
  async softDelete(
    productIds: string[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<[TEntity[], Record<string, unknown[]>]> {
    const [entities, cascadeEntities] =
      await this.productRepository_.softDelete(productIds, {
        transactionManager: sharedContext.transactionManager,
      })

    sharedContext.messageAggregator?.save(
      entities.map(({ id }) => {
        return composeMessage(ProductEvents.PRODUCT_DELETED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: Product.name,
          context: sharedContext,
        })
      })
    )

    return [entities, cascadeEntities]
  }

  @InjectTransactionManager(doNotForceTransaction, "productRepository_")
  async restore(
    productIds: string[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<[TEntity[], Record<string, unknown[]>]> {
    const [entities, cascadeEntities] = await this.productRepository_.restore(
      productIds,
      {
        transactionManager: sharedContext.transactionManager,
      }
    )

    sharedContext.messageAggregator?.save(
      entities.map(({ id }) => {
        return composeMessage(ProductEvents.PRODUCT_CREATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: Product.name,
          context: sharedContext,
        })
      })
    )

    return [entities, cascadeEntities]
  }
}
