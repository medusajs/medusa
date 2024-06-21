import {
  Context,
  DAL,
  FilterableProductProps,
  FindConfig,
  ProductTypes,
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

export default class ProductService extends ModulesSdkUtils.MedusaInternalService<InjectedDependencies>(
  Product
)<Product> {
  protected readonly productRepository_: DAL.RepositoryService<Product>

  constructor({ productRepository }: InjectedDependencies) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.productRepository_ = productRepository
  }

  @InjectManager("productRepository_")
  async list(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<Product> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Product[]> {
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
  ): Promise<[Product[], number]> {
    return await super.listAndCount(
      ProductService.normalizeFilters(filters),
      config,
      sharedContext
    )
  }

  protected static normalizeFilters(
    filters: FilterableProductProps = {}
  ): NormalizedFilterableProductProps {
    const normalized = filters as NormalizedFilterableProductProps
    if (normalized.category_id) {
      if (Array.isArray(normalized.category_id)) {
        normalized.categories = {
          id: { $in: normalized.category_id },
        }
      } else {
        normalized.categories = {
          id: normalized.category_id as string,
        }
      }
      delete normalized.category_id
    }

    return normalized
  }
}
