import { FilterableProductProps, ProductStatus } from "../../product"

export interface ExportProductsDTO {
  select: string[]
  filter?: FilterableProductProps
}
