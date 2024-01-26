import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"
import { Product } from "@models"
import { IProductRepository, ProductServiceTypes } from "@types"

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
  protected readonly productRepository_: IProductRepository<TEntity>

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
}
