import { ProductOption } from "@models"
import { Context, DAL, ProductTypes } from "@medusajs/types"
import { ProductOptionRepository } from "@repositories"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"
import { doNotForceTransaction } from "../utils"

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

  @InjectTransactionManager(doNotForceTransaction, "productOptionRepository_")
  async create(
    data: ProductTypes.CreateProductOptionOnlyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.productOptionRepository_ as ProductOptionRepository
    ).create(data, {
      transactionManager: sharedContext.transactionManager,
    })) as TEntity[]
  }
}
