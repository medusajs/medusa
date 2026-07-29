import { FilterableInventoryItemProps } from "../../inventory"

/**
 * The configurations to export inventory items.
 */
export interface ExportInventoryItemsDTO {
  /**
   * The fields to select. These fields will be passed to
   * [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query), so you can
   * pass inventory item properties or any relation names, including custom links.
   */
  select: string[]
  /**
   * The filters to select which inventory items to export.
   */
  filter?: FilterableInventoryItemProps & {
    location_levels?: { location_id?: string | string[] }
  }
  /**
   * The batch size to use for querying inventory items.
   */
  batch_size?: number | string
}
