import { ProductOption } from "@models"
import { Context, DAL, ProductTypes } from "@medusajs/types"
import { ProductOptionRepository } from "@repositories"

type InjectedDependencies = {
  productOptionRepository: DAL.RepositoryService
}

export default class ProductOptionService<
  TEntity extends ProductOption = ProductOption
> {
  protected readonly productOptionRepository_: DAL.RepositoryService

  constructor({ productOptionRepository }: InjectedDependencies) {
    this.productOptionRepository_ =
      productOptionRepository as ProductOptionRepository
  }

  async create(
    data: ProductTypes.CreateProductOptionOnlyDTO[],
    sharedContext?: Context
  ) {
    return await this.productOptionRepository_.transaction(
      async (manager) => {
        return await this.productOptionRepository_.create(data, {
          transactionManager: manager,
        })
      },
      { transaction: sharedContext?.transactionManager }
    )
  }
}
