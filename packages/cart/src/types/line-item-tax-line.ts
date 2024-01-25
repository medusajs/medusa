import { CreateTaxLineDTO, UpdateTaxLineDTO } from "./tax-line"
import { LineItemTaxLine } from "@models"
import { AbstractService } from "@medusajs/utils"
import { ILineItemTaxLineRepository } from "./repositories"

export interface ILineItemTaxLineService<
  TEntity extends LineItemTaxLine = LineItemTaxLine
> extends AbstractService<
    TEntity,
    {
      lineItemTaxLineRepository: ILineItemTaxLineRepository<TEntity>
    },
    {
      create: CreateLineItemTaxLineDTO
      update: UpdateLineItemTaxLineDTO
    }
  > {}

export interface CreateLineItemTaxLineDTO extends CreateTaxLineDTO {
  item_id: string
}

export interface UpdateLineItemTaxLineDTO extends UpdateTaxLineDTO {
  item_id: string
}
