import { CreateTaxLineDTO, UpdateTaxLineDTO } from "./tax-line"
import { ShippingMethodTaxLine } from "@models"
import { AbstractService } from "@medusajs/utils"
import { IShippingMethodTaxLineRepository } from "./repositories"

export interface IShippingMethodTaxLineService<
  TEntity extends ShippingMethodTaxLine = ShippingMethodTaxLine
> extends AbstractService<
    TEntity,
    {
      shippingMethodTaxLineRepository: IShippingMethodTaxLineRepository<TEntity>
    },
    {
      create: CreateShippingMethodTaxLineDTO
      update: UpdateShippingMethodTaxLineDTO
    }
  > {}
export interface CreateShippingMethodTaxLineDTO extends CreateTaxLineDTO {
  shipping_method_id: string
}

export interface UpdateShippingMethodTaxLineDTO extends UpdateTaxLineDTO {
  shipping_method_id: string
}
