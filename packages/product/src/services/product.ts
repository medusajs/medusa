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
  ModulesSdkUtils,
  ProductUtils,
  composeMessage,
} from "@medusajs/utils"
import { Product } from "@models"
import { ProductEvents } from "../types"
import { ProductServiceTypes } from "../types/services"

type InjectedDependencies = {
  productRepository: DAL.RepositoryService
}

export default class ProductService<
  TEntity extends Product = Product
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ProductTypes.CreateProductOnlyDTO
    update: ProductServiceTypes.UpdateProductDTO
  }
>(Product)<TEntity> {
  protected readonly productRepository_: DAL.RepositoryService<TEntity>

  constructor({ productRepository }: InjectedDependencies) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.productRepository_ = productRepository
  }

  @InjectManager("productRepository_")
  async list<TEntityMethod = ProductTypes.ProductDTO>(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<TEntityMethod> = {},
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

    return await super.list<TEntityMethod>(filters, config, sharedContext)
  }

  @InjectManager("productRepository_")
  async listAndCount<TEntityMethod = ProductTypes.ProductDTO>(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<TEntityMethod> = {},
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

    return await super.listAndCount<TEntityMethod>(
      filters,
      config,
      sharedContext
    )
  }

  @InjectTransactionManager("productRepository_")
  async create(
    data: ProductTypes.CreateProductOnlyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    data.forEach((product) => {
      product.status ??= ProductUtils.ProductStatus.DRAFT
    })

    const products = await this.productRepository_.create(
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

  @InjectTransactionManager("productRepository_")
  async update(
    data: ProductServiceTypes.UpdateProductDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const products = await this.productRepository_.update(
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

  @InjectTransactionManager("productRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
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

  @InjectTransactionManager("productRepository_")
  async softDelete(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
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

  @InjectTransactionManager("productRepository_")
  async restore(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
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
