import { ProductOptionValue } from "@models"
import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { ProductOptionValueServiceTypes } from "@types"

type InjectedDependencies = {
  productOptionValueRepository: DAL.RepositoryService
}

export default class ProductOptionValueService<
  TEntity extends ProductOptionValue = ProductOptionValue
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ProductOptionValueServiceTypes.CreateProductOptionValueDTO
    update: ProductOptionValueServiceTypes.UpdateProductOptionValueDTO
  }
>(ProductOptionValue)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
