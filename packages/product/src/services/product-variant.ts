import { Product, ProductVariant } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { isString, ModulesSdkUtils } from "@medusajs/utils"
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

  async create(
    productOrId: TProduct | string,
    data: ProductTypes.CreateProductVariantOnlyDTO[],
    sharedContext?: Context
  ): Promise<TEntity[]> {
    return await this.productVariantRepository_.transaction(
      async (manager) => {
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

        return await this.productVariantRepository_.create(data_, {
          transactionManager: manager,
        })
      },
      { transaction: sharedContext?.transactionManager }
    )
  }
}
