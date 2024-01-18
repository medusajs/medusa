import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { LineItem } from "@models"
import { CreateLineItemDTO, UpdateLineItemDTO } from "@types"

type InjectedDependencies = {
  lineItemRepository: DAL.RepositoryService
}

export default class LineItemService<
  TEntity extends LineItem = LineItem
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateLineItemDTO
    update: UpdateLineItemDTO
  }
>(LineItem)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
