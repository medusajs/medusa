import { ProductTag } from "@models"
import { RepositoryService } from "../types"

type InjectedDependencies = {
  productTagRepository: RepositoryService<ProductTag>
}

export default class ProductTagService {
  protected readonly productTagRepository_: RepositoryService<ProductTag>

  constructor({ productTagRepository }: InjectedDependencies) {
    this.productTagRepository_ = productTagRepository
  }

  async list(
    selector: Record<any, any> = {},
    config: Record<any, any> = {}
  ): Promise<ProductTag[]> {
    return await this.productTagRepository_.find()
  }
}
