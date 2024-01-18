import { Context, DAL, ProductTypes } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  isString,
} from "@medusajs/utils"
import { Product, ProductVariant } from "@models"
import {
  composeMessage,
  InjectManager,
  import
} from { Context, DAL, ProductTypes }
from "@medusajs/types"

import { Modules } from "@medusajs/modules-sdk"
import { InternalContext, ProductVariantEvents } from "../types"
import { ProductVariantServiceTypes } from "../types/services"

import ProductService from "./product"

type InjectedDependencies = {
  productVariantRepository: DAL.RepositoryService
  productService: ProductService<any>
}

export default class ProductVariantService<
  TEntity extends ProductVariant = ProductVariant,
  TProduct extends Product = Product
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ProductTypes.CreateProductVariantOnlyDTO
    update: ProductVariantServiceTypes.UpdateProductVariantDTO
  }
>(ProductVariant)<TEntity> {
  protected readonly productVariantRepository_: DAL.RepositoryService<TEntity>
  protected readonly productService_: ProductService<TProduct>

  constructor({
    productVariantRepository,
    productService,
  }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.productVariantRepository_ = productVariantRepository
    this.productService_ = productService
  }

  @InjectTransactionManager("productVariantRepository_")
  // @ts-ignore
  override async create(
    productOrId: TProduct | string,
    data: ProductTypes.CreateProductVariantOnlyDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    let product = productOrId as unknown as Product

    if (isString(productOrId)) {
      product = await this.productService_.retrieve(
        productOrId,
        { relations: ["variants"] },
        sharedContext
      )
    }

    let computedRank = product.variants.toArray().length

    const data_ = [...data]
    data_.forEach((variant) => {
      delete variant?.product_id

      Object.assign(variant, {
        variant_rank: computedRank++,
        product,
      })
    })

    const variants = await this.productVariantRepository_.create(data_, {
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

  @InjectTransactionManager("productVariantRepository_")
  // @ts-ignore
  override async update(
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

    const variants = this.productVariantRepository_.update(variantsData, {
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

  @InjectTransactionManager("productVariantRepository_")
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

  @InjectTransactionManager("productVariantRepository_")
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

  @InjectTransactionManager("productVariantRepository_")
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
