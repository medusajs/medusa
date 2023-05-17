import { ProductTagService, ProductVariantService } from "@services"
import { Product, ProductTag, ProductVariant } from "@models"
import { RepositoryService } from "../types"
import { FindConfig, ProductTypes, SharedContext } from "@medusajs/types"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  productRepository: RepositoryService
  productVariantService: ProductVariantService
  productTagService: ProductTagService
}

export default class ProductService implements ProductTypes.IProductService {
  protected readonly productRepository_: RepositoryService
  protected readonly productVariantService: ProductVariantService
  protected readonly productTagService: ProductTagService

  constructor({
    productRepository,
    productVariantService,
    productTagService,
  }: InjectedDependencies) {
    this.productRepository_ = productRepository
    this.productVariantService = productVariantService
    this.productTagService = productTagService
  }

  async list<T = Product>(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    sharedContext?: SharedContext
  ): Promise<T[]> {
    const queryOptions = buildQuery<T>(filters, config)
    return await this.productRepository_.find<T>(queryOptions)
  }

  async listVariants<T = ProductVariant>(
    filters: ProductTypes.FilterableProductVariantProps = {},
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    sharedContext?: SharedContext
  ): Promise<T[]> {
    return await this.productVariantService.list()
  }

  async listTags<T = ProductTag>(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    sharedContext?: SharedContext
  ): Promise<T[]> {
    return await this.productTagService.list()
  }

  async listCollections() {
    return []
  }
}
