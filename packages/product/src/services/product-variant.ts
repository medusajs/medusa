import { Product, ProductVariant } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { isString, ModulesSdkUtils } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import ProductService from "./product"

type InjectedDependencies = {
  productVariantRepository: DAL.RepositoryService
  productService: ProductService<any>
}

export default class ProductVariantService<
  TEntity = ProductVariant,
  TProduct = Product
> {
  protected readonly productVariantRepository_: DAL.RepositoryService<TEntity>
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
    const queryOptions = ModulesSdkUtils.buildQuery<TEntity>(filters, config)
    return await this.productVariantRepository_.find(
      queryOptions,
      sharedContext
    )
  }

  async create(
    productOrId: TProduct | string,
    data: ProductTypes.CreateProductVariantOnlyDTO[],
    sharedContext?: Context
  ): Promise<TEntity[]> {
    return await this.productVariantRepository_.transaction(
      async (manager) => {
        const manager_ = manager as SqlEntityManager

        let product = productOrId as unknown as Product

        if (isString(productOrId)) {
          product = (await this.productService_.retrieve(
            productOrId as string,
            sharedContext
          )) as unknown as Product
        }

        let computedRank = product.variants.toArray().length

        const variants: ProductVariant[] = []
        data.forEach((variant) => {
          variants.push(
            manager_.create(ProductVariant, {
              ...variant,
              variant_rank: computedRank++,
              product,
            })
          )
        })

        manager_.persist(variants)
        return variants as unknown as TEntity[]
      },
      { transaction: sharedContext?.transactionManager }
    )
  }
}
