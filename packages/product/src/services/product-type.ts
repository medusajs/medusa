import { ProductType } from "@models"
import { Context, CreateProductTypeDTO, DAL } from "@medusajs/types"

type InjectedDependencies = {
  productTypeRepository: DAL.RepositoryService
}

export default class ProductTypeService<TEntity = ProductType> {
  protected readonly productTypeRepository_: DAL.RepositoryService<TEntity>

  constructor({ productTypeRepository }: InjectedDependencies) {
    this.productTypeRepository_ = productTypeRepository
  }

  upsert(types: CreateProductTypeDTO[], sharedContext?: Context) {
    return this.productTypeRepository_.upsert!(types, sharedContext)
  }
}
