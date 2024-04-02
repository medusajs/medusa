import {
  Context,
  DAL,
  FindConfig,
  ProductTypes,
  BaseFilterable,
} from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"
import { Product } from "@models"

type InjectedDependencies = {
  productRepository: DAL.RepositoryService
}

type NormalizedFilterableProductProps = ProductTypes.FilterableProductProps & {
  categories?: {
    id: string | { $in: string[] }
  }
}

export default class ProductService<
  TEntity extends Product = Product
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  Product
)<TEntity> {
  protected readonly productRepository_: DAL.RepositoryService<TEntity>

  constructor({ productRepository }: InjectedDependencies) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.productRepository_ = productRepository
  }

  @InjectManager("productRepository_")
  async list(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<TEntity> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await super.list(
      ProductService.normalizeFilters(filters),
      config,
      sharedContext
    )
  }

  @InjectManager("productRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<any> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return await super.listAndCount(
      ProductService.normalizeFilters(filters),
      config,
      sharedContext
    )
  }

  protected static normalizeFilters(
    filters: NormalizedFilterableProductProps = {}
  ): NormalizedFilterableProductProps {
    if (filters.category_id) {
      if (Array.isArray(filters.category_id)) {
        filters.categories = {
          id: { $in: filters.category_id },
        }
      } else {
        filters.categories = {
          id: filters.category_id as string,
        }
      }
      delete filters.category_id
    }

    return filters
  }
}
