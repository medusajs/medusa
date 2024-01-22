import {
  CreateLineItemTaxLineDTO,
  DAL,
  UpdateLineItemTaxLineDTO,
} from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { LineItemTaxLine } from "@models"

type InjectedDependencies = {
  lineItemTaxLineRepository: DAL.RepositoryService
}

export default class LineItemTaxLineService<
  TEntity extends LineItemTaxLine = LineItemTaxLine
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateLineItemTaxLineDTO
    update: UpdateLineItemTaxLineDTO
  }
>(LineItemTaxLine)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
