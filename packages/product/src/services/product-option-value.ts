import { Context, DAL } from "@medusajs/types"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"
import { ProductOptionValue } from "@models"
import { ProductOptionValueServiceTypes } from "@types"

type InjectedDependencies = {
  productOptionValueRepository: DAL.RepositoryService
}

export default class ProductOptionValueService<
  TEntity extends ProductOptionValue = ProductOptionValue
> {
  // eslint-disable-next-line max-len
  protected readonly productOptionValueRepository_: DAL.RepositoryService<TEntity>

  constructor({ productOptionValueRepository }: InjectedDependencies) {
    this.productOptionValueRepository_ = productOptionValueRepository
  }

  @InjectTransactionManager("productOptionValueRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    return await this.productOptionValueRepository_.delete(ids, sharedContext)
  }

  @InjectTransactionManager("productOptionValueRepository_")
  async upsert(
    data: (
      | ProductOptionValueServiceTypes.UpdateProductOptionValueDTO
      | ProductOptionValueServiceTypes.CreateProductOptionValueDTO
    )[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], TEntity[], TEntity[]]> {
    return await this.productOptionValueRepository_.upsert!(data, sharedContext)
  }
}
