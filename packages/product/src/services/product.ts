import { ProductVariantService, ProductTagService } from "@services"
import { Product } from "@models"
import { RepositoryService } from "../types"

type InjectedDependencies = {
  productRepository: RepositoryService<Product>
  productVariantService: ProductVariantService
  productTagService: ProductTagService
}

export default class ProductService {
  protected readonly productRepository_: RepositoryService<Product>
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

  async list(
    selector: Record<any, any> = {},
    config: Record<any, any> = {}
  ): Promise<Product[]> {
    return await this.productRepository_.find()
  }

  async listVariants() {
    return await this.productVariantService.list()
  }

  async listTags() {
    return await this.productTagService.list()
  }
}
