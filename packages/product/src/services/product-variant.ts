import { Context, DAL, ProductTypes } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  isString,
} from "@medusajs/utils"
import { Product, ProductVariant } from "@models"

import { ProductVariantServiceTypes } from "@types"
import ProductService from "./product"

type InjectedDependencies = {
  productVariantRepository: DAL.RepositoryService
  productService: ProductService<any>
}

export default class ProductVariantService<
  TEntity extends ProductVariant = ProductVariant,
  TProduct extends Product = Product
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  ProductVariant
)<TEntity> {
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

    return await super.create(data_, sharedContext)
  }

  @InjectTransactionManager("productVariantRepository_")
  // @ts-ignore
  override async update(
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

    return await super.update(variantsData, sharedContext)
  }
}
