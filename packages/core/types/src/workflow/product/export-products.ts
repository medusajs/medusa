import { FilterableProductProps } from "../../product"

export interface ExportProductsDTO {
  select: string[]
  filter?: FilterableProductProps
}
