import { ProductVariant } from "@models"
import { RepositoryService } from "../types/dal/repository-service"

type InjectedDependencies = {
  productRepository: RepositoryService<ProductVariant>
}

export default class ProductVariantService {
  protected readonly productRepository_: RepositoryService<ProductVariant>

  constructor({ productRepository }: InjectedDependencies) {
    this.productRepository_ = productRepository
  }

  async list(
    selector: Record<any, any> = {},
    config: Record<any, any> = {}
  ): Promise<ProductVariant[]> {
    return await this.productRepository_.find()
  }
}
