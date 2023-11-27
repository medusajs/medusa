import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  isString,
  retrieveEntity,
} from "@medusajs/utils"
import { Product, ProductVariant } from "@models"
import { ProductVariantRepository } from "@repositories"

import { ProductVariantServiceTypes } from "../types/services"
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

  @InjectTransactionManager("productVariantRepository_")
  async create(
    productOrId: TProduct | string,
    data: ProductTypes.CreateProductVariantOnlyDTO[],
    @MedusaContext() sharedContext: Context = {}
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

    return (await (
      this.productVariantRepository_ as ProductVariantRepository
    ).create(data_, {
      transactionManager: sharedContext.transactionManager,
    })) as TEntity[]
  }

  @InjectTransactionManager("productVariantRepository_")
  async update(
    productOrId: TProduct | string,
    data: ProductVariantServiceTypes.UpdateProductVariantDTO[],
    @MedusaContext() sharedContext: Context = {}
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

    return (await (
      this.productVariantRepository_ as ProductVariantRepository
    ).update(variantsData, {
      transactionManager: sharedContext.transactionManager,
    })) as TEntity[]
  }

  @InjectTransactionManager("productVariantRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    return await this.productVariantRepository_.delete(ids, {
      transactionManager: sharedContext.transactionManager,
    })
  }

  @InjectTransactionManager("productVariantRepository_")
  async softDelete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productVariantRepository_.softDelete(ids, {
      transactionManager: sharedContext.transactionManager,
    })
  }

  @InjectTransactionManager("productVariantRepository_")
  async restore(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], Record<string, unknown[]>]> {
    return await this.productVariantRepository_.restore(ids, {
      transactionManager: sharedContext.transactionManager,
    })
  }
}
