import { ProductType } from "@models"
import { Context, CreateProductTypeDTO, DAL } from "@medusajs/types"

type InjectedDependencies = {
  productTypeRepository: DAL.RepositoryService
}

export default class ProductTypeService<
  TEntity extends ProductType = ProductType
> {
  protected readonly productTypeRepository_: DAL.RepositoryService

  constructor({ productTypeRepository }: InjectedDependencies) {
    this.productTypeRepository_ = productTypeRepository
  }

  async upsert(
    types: CreateProductTypeDTO[],
    sharedContext?: Context
  ): Promise<TEntity[]> {
    return (await this.productTypeRepository_.upsert!(
      types,
      sharedContext
    )) as TEntity[]
  }
}
