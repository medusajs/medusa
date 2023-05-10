import { ProductVariantService } from "@services"
import { Product } from "@models"
import { RepositoryService } from "../types"

type InjectedDependencies = {
  productRepository: RepositoryService<Product>
  productVariantService: ProductVariantService
}

export default class ProductService {
  protected readonly productRepository_: RepositoryService<Product>
  protected readonly productVariantService: ProductVariantService

  constructor({
    productRepository,
    productVariantService,
  }: InjectedDependencies) {
    this.productRepository_ = productRepository
    this.productVariantService = productVariantService
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
}
