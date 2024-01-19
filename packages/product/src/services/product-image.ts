import { Image } from "@models"
import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"

type InjectedDependencies = {
  productImageRepository: DAL.RepositoryService
}

export default class ProductImageService<
  TEntity extends Image = Image
> extends ModulesSdkUtils.abstractServiceFactory<InjectedDependencies>(
  Image
)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
