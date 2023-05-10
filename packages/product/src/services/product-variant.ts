import { ProductVariant } from "@models"
import { RepositoryService } from "../types"

type InjectedDependencies = {
  productVariantRepository: RepositoryService<ProductVariant>
}

export default class ProductVariantService {
  protected readonly productVariantRepository_: RepositoryService<ProductVariant>

  constructor({ productVariantRepository }: InjectedDependencies) {
    this.productVariantRepository_ = productVariantRepository
  }

  async list(
    selector: Record<any, any> = {},
    config: Record<any, any> = {}
  ): Promise<ProductVariant[]> {
    return await this.productVariantRepository_.find()
  }
}
