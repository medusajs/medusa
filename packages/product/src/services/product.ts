import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"
import { Product } from "@models"

type InjectedDependencies = {
  productRepository: DAL.RepositoryService
}

export default class ProductService<
  TEntity extends Product = Product
> extends ModulesSdkUtils.abstractServiceFactory<
  Product,
  InjectedDependencies,
  {
    retrieve: ProductTypes.ProductDTO
    list: ProductTypes.ProductDTO
    listAndCount: ProductTypes.ProductDTO
    create: ProductTypes.CreateProductOnlyDTO
    update: ProductTypes.UpdateProductDTO
  }
>(Product) {
  protected readonly productRepository_: DAL.RepositoryService

  constructor({ productRepository }: InjectedDependencies) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.productRepository_ = productRepository
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

    return (await this.list(filters, config, sharedContext)) as TEntity[]
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

    return (await this.listAndCount(filters, config, sharedContext)) as [
      TEntity[],
      number
    ]
  }
}
