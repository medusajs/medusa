import { ProductVariantService } from "@services"
import { Product } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"

type InjectedDependencies = {
  manager: SqlEntityManager
  productVariantService: ProductVariantService
}

export default class ProductService {
  protected readonly manager: SqlEntityManager

  protected readonly productVariantService: ProductVariantService

  constructor({ manager, productVariantService }: InjectedDependencies) {
    this.manager = manager
    this.productVariantService = productVariantService
  }

  async list(
    selector: Record<any, any> = {},
    config: Record<any, any> = {}
  ): Promise<Product[]> {
    return await this.manager.find(Product, {})
  }

  async listVariants() {
    return await this.productVariantService.list()
  }
}
