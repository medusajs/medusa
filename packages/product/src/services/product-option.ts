import { ProductOption } from "@models"
import { Context, DAL, ProductTypes } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

type InjectedDependencies = {
  productOptionRepository: DAL.RepositoryService
}

export default class ProductOptionService<TEntity = ProductOption> {
  protected readonly productOptionRepository_: DAL.RepositoryService<TEntity>

  constructor({ productOptionRepository }: InjectedDependencies) {
    this.productOptionRepository_ = productOptionRepository
  }

  async create(
    data: (ProductTypes.CreateProductOptionDTO & { product: { id: string } })[],
    sharedContext?: Context
  ) {
    return await this.productOptionRepository_.transaction(
      async (manager) => {
        const manager_ = manager as SqlEntityManager
        const options: ProductOption[] = []
        data.forEach((option) => {
          options.push(manager_.create(ProductOption, option))
        })

        await manager_.persist(options)
        return options as unknown as TEntity[]
      },
      { transaction: sharedContext?.transactionManager }
    )
  }
}
