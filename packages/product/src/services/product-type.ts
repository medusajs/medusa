import { ProductType } from "@models"
import { Context, CreateProductTypeDTO, DAL } from "@medusajs/types"
import { ProductTypeRepository } from "@repositories"

type InjectedDependencies = {
  productTypeRepository: DAL.RepositoryService
}

export default class ProductTypeService<
  TEntity extends ProductType = ProductType
> {
  protected readonly productTypeRepository_: ProductTypeRepository

  constructor({ productTypeRepository }: InjectedDependencies) {
    this.productTypeRepository_ = productTypeRepository as ProductTypeRepository
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
