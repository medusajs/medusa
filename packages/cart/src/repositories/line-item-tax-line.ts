import { DALUtils } from "@medusajs/utils"
import { LineItemTaxLine } from "@models"
import { CreateLineItemTaxLineDTO, UpdateLineItemTaxLineDTO } from "@types"

export class LineItemTaxLineRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  LineItemTaxLine,
  {
    create: CreateLineItemTaxLineDTO
    update: UpdateLineItemTaxLineDTO
  }
>(LineItemTaxLine) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
