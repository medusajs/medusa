import { ProductVariant } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"

type InjectedDependencies = {
  manager: SqlEntityManager
}

export default class ProductVariantService {
  protected readonly manager: SqlEntityManager

  constructor({ manager }: InjectedDependencies) {
    this.manager = manager
  }

  async list(
    selector: Record<any, any> = {},
    config: Record<any, any> = {}
  ): Promise<ProductVariant[]> {
    const productVariants = await this.manager.find(ProductVariant, {})

    return productVariants
  }
}
