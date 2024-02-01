import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { Cart } from "@models"
import { CreateCartDTO, UpdateCartDTO } from "@types"

type InjectedDependencies = {
  cartRepository: DAL.RepositoryService
}

export default class CartService<
  TEntity extends Cart = Cart
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateCartDTO
    update: UpdateCartDTO
  }
>(Cart)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
