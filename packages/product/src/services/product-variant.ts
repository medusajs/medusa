import { Product, ProductVariant } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import {
  InjectTransactionManager,
  isString,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"

import ProductService from "./product"
import { doNotForceTransaction } from "../utils"
import { ProductVariantRepository } from "@repositories"

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

  async retrieve(
    productVariantId: string,
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    sharedContext?: Context
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

  async list(
    filters: ProductTypes.FilterableProductVariantProps = {},
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    sharedContext?: Context
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

  async listAndCount(
    filters: ProductTypes.FilterableProductVariantProps = {},
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    sharedContext?: Context
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
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    let product = productOrId as unknown as Product

    if (isString(productOrId)) {
      product = await this.productService_.retrieve(
        productOrId as string,
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

    return (await (
      this.productVariantRepository_ as ProductVariantRepository
    ).create(data_, {
      transactionManager: sharedContext.transactionManager,
    })) as TEntity[]
  }
}
