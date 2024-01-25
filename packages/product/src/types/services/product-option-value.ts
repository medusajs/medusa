import { AbstractService } from "@medusajs/utils"
import { IProductOptionValueRepository } from "../repositories"
import { ProductOptionValue } from "@models"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProductOptionValueService<
  TEntity extends ProductOptionValue = ProductOptionValue
> extends AbstractService<
    TEntity,
    { productOptionValueRepository: IProductOptionValueRepository<TEntity> },
    {
      create: CreateProductOptionValueDTO
      update: UpdateProductOptionValueDTO
    }
  > {}

export interface UpdateProductOptionValueDTO {
  id: string
  value: string
  option_id: string
  metadata?: Record<string, unknown> | null
}

export interface CreateProductOptionValueDTO {
  id?: string
  value: string
  option_id: string
  variant_id: string
  metadata?: Record<string, unknown> | null
}
