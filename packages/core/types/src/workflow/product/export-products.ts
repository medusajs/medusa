import { FilterableProductProps } from "../../product"

/**
 * The configurations to export products.
 */
export interface ExportProductsDTO {
  /**
   * The fields to select. These fields will be passed to
   * [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query), so you can
   * pass product properties or any relation names, including custom links.
   */
  select: string[]
  /**
   * The filters to select which products to export.
   */
  filter?: FilterableProductProps
  /**
   * The batch size to use for querying products.
   */
  batch_size?: number | string
}
