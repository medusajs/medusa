import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  composeMessage,
  isString,
  retrieveEntity,
} from "@medusajs/utils"
import { Product, ProductVariant } from "@models"
import { ProductVariantRepository } from "@repositories"

import { Modules } from "@medusajs/modules-sdk"
import { InternalContext, ProductVariantEvents } from "../types"
import { ProductVariantServiceTypes } from "../types/services"
import { doNotForceTransaction } from "../utils"
import ProductService from "./product"

type InjectedDependencies = {
  productVariantRepository: DAL.RepositoryService
  productService: ProductService<any>
}

export default class ProductVariantService<
  TEntity extends ProductVariant = ProductVariant,
  TProduct extends Product = Product
> {
  protected readonly productVariantRepository_: DAL.RepositoryService
  protected readonly productService_: ProductService<TProduct>

  constructor({
    productVariantRepository,
    productService,
  }: InjectedDependencies) {
    this.productVariantRepository_ = productVariantRepository
    this.productService_ = productService
  }

  @InjectManager("productVariantRepository_")
  async retrieve(
    productVariantId: string,
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      ProductVariant,
      ProductTypes.ProductVariantDTO
    >({
      id: productVariantId,
      entityName: ProductVariant.name,
      repository: this.productVariantRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("productVariantRepository_")
  async list(
    filters: ProductTypes.FilterableProductVariantProps = {},
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<ProductVariant>(
      filters,
      config
    )

    return (await this.productVariantRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("productVariantRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductVariantProps = {},
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<ProductVariant>(
      filters,
      config
    )

    return (await this.productVariantRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager(doNotForceTransaction, "productVariantRepository_")
  async create(
    productOrId: TProduct | string,
    data: ProductTypes.CreateProductVariantOnlyDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    let product = productOrId as unknown as Product

    if (isString(productOrId)) {
      product = await this.productService_.retrieve(
        productOrId,
        {},
        sharedContext
      )
    }

    let computedRank = product.variants.toArray().length

    const data_ = [...data]
    data_.forEach((variant) => {
      Object.assign(variant, {
        variant_rank: computedRank++,
        product,
      })
    })

    const variants = await (
      this.productVariantRepository_ as ProductVariantRepository
    ).create(data_, {
      transactionManager: sharedContext.transactionManager,
    })

    sharedContext.messageAggregator?.save(
      variants.map(({ id }) => {
        return composeMessage(ProductVariantEvents.PRODUCT_VARIANT_CREATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductVariant.name,
          context: sharedContext,
        })
      })
    )

    return variants as TEntity[]
  }

  @InjectTransactionManager(doNotForceTransaction, "productVariantRepository_")
  async update(
    productOrId: TProduct | string,
    data: ProductVariantServiceTypes.UpdateProductVariantDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    let product = productOrId as unknown as Product

    if (isString(productOrId)) {
      product = await this.productService_.retrieve(
        productOrId,
        {},
        sharedContext
      )
    }

    const variantsData = [...data]
    variantsData.forEach((variant) => Object.assign(variant, { product }))

    const variants = await (
      this.productVariantRepository_ as ProductVariantRepository
    ).update(variantsData, {
      transactionManager: sharedContext.transactionManager,
    })

    sharedContext.messageAggregator?.save(
      variants.map(({ id }) => {
        return composeMessage(ProductVariantEvents.PRODUCT_VARIANT_UPDATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductVariant.name,
          context: sharedContext,
        })
      })
    )

    return variants as TEntity[]
  }

  @InjectTransactionManager(doNotForceTransaction, "productVariantRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<void> {
    await this.productVariantRepository_.delete(ids, {
      transactionManager: sharedContext.transactionManager,
    })

    sharedContext.messageAggregator?.save(
      ids.map((id) => {
        return composeMessage(ProductVariantEvents.PRODUCT_VARIANT_DELETED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductVariant.name,
          context: sharedContext,
        })
      })
    )
  }

  @InjectTransactionManager(doNotForceTransaction, "productVariantRepository_")
  async softDelete(
    ids: string[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<[TEntity[], Record<string, unknown[]>]> {
    const [entities, cascadeEntities] =
      await this.productVariantRepository_.softDelete(ids, {
        transactionManager: sharedContext.transactionManager,
      })

    sharedContext.messageAggregator?.save(
      entities.map(({ id }) => {
        return composeMessage(ProductVariantEvents.PRODUCT_VARIANT_DELETED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: Product.name,
          context: sharedContext,
        })
      })
    )

    return [entities, cascadeEntities]
  }

  @InjectTransactionManager(doNotForceTransaction, "productVariantRepository_")
  async restore(
    ids: string[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<[TEntity[], Record<string, unknown[]>]> {
    const [entities, cascadeEntities] =
      await this.productVariantRepository_.restore(ids, {
        transactionManager: sharedContext.transactionManager,
      })

    sharedContext.messageAggregator?.save(
      entities.map(({ id }) => {
        return composeMessage(ProductVariantEvents.PRODUCT_VARIANT_CREATED, {
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
