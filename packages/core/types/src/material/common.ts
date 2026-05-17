import { BaseFilterable } from "../dal"

export type MaterialType =
  | "finished"
  | "semi"
  | "normal"
  | "box"
  | "virtual"

export type SalesType =
  | "normal"
  | "combo"
  | "gift"
  | "choice"
  | "box"
  | "lucky_bag"

export type SourceType = "local" | "api"

/**
 * The basic material details.
 */
export interface BasicMaterialDTO {
  /**
   * The ID of the basic material.
   */
  id: string

  /**
   * The material code.
   */
  material_code: string

  /**
   * The material name.
   */
  material_name: string

  /**
   * The SPU code.
   */
  spu_code?: string

  /**
   * The material type.
   */
  material_type?: MaterialType

  /**
   * The category ID.
   */
  category_id?: string

  /**
   * Whether the material is SN managed.
   */
  sn_managed?: boolean

  /**
   * Whether the material is stock controlled.
   */
  stock_controlled?: boolean

  /**
   * The tax rate.
   */
  tax_rate?: number

  /**
   * The tax name.
   */
  tax_name?: string

  /**
   * The tax code.
   */
  tax_code?: string

  /**
   * Whether the material supports omnichannel.
   */
  omnichannel?: boolean

  /**
   * Whether the material supports O2O.
   */
  o2o_enabled?: boolean

  /**
   * The color.
   */
  color?: string

  /**
   * The size.
   */
  size?: string

  /**
   * The source type.
   */
  source?: SourceType

  /**
   * The org ID.
   */
  org_id?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * The created at of the basic material.
   */
  created_at: string

  /**
   * The updated at of the basic material.
   */
  updated_at: string
}

/**
 * The filters to apply on the retrieved basic materials.
 */
export interface FilterableBasicMaterialProps
  extends BaseFilterable<FilterableBasicMaterialProps> {
  /**
   * Find basic materials by name or code through this search term.
   */
  q?: string

  /**
   * The IDs to filter the basic materials by.
   */
  id?: string | string[]

  /**
   * Filter basic materials by their material codes.
   */
  material_code?: string | string[]

  /**
   * Filter basic materials by their material types.
   */
  material_type?: MaterialType | MaterialType[]
}

/**
 * The sales material details.
 */
export interface SalesMaterialDTO {
  /**
   * The ID of the sales material.
   */
  id: string

  /**
   * The shop ID.
   */
  shop_id: string

  /**
   * The sales code.
   */
  sales_code: string

  /**
   * The sales name.
   */
  sales_name: string

  /**
   * The sales type.
   */
  sales_type?: SalesType

  /**
   * The basic material ID.
   */
  basic_material_id?: string

  /**
   * Whether the sales material is bound to a basic material.
   */
  is_bound?: boolean

  /**
   * The customer class ID.
   */
  customer_class_id?: string

  /**
   * The org ID.
   */
  org_id?: string

  /**
   * The tax rate.
   */
  tax_rate?: number

  /**
   * The tax name.
   */
  tax_name?: string

  /**
   * The tax code.
   */
  tax_code?: string

  /**
   * The source type.
   */
  source?: SourceType

  /**
   * The status of the sales material.
   */
  status?: "active" | "inactive"

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * The created at of the sales material.
   */
  created_at: string

  /**
   * The updated at of the sales material.
   */
  updated_at: string
}

/**
 * The filters to apply on the retrieved sales materials.
 */
export interface FilterableSalesMaterialProps
  extends BaseFilterable<FilterableSalesMaterialProps> {
  /**
   * Find sales materials by name or code through this search term.
   */
  q?: string

  /**
   * The IDs to filter the sales materials by.
   */
  id?: string | string[]

  /**
   * Filter sales materials by their shop IDs.
   */
  shop_id?: string | string[]

  /**
   * Filter sales materials by their sales codes.
   */
  sales_code?: string | string[]

  /**
   * Filter sales materials by their sales types.
   */
  sales_type?: SalesType | SalesType[]
}

/**
 * The combo item details.
 */
export interface ComboItemDTO {
  /**
   * The ID of the combo item.
   */
  id: string

  /**
   * The quantity of the child material in the combo.
   */
  quantity?: number

  /**
   * Whether the combo item is optional.
   */
  is_optional?: boolean

  /**
   * The sort order of the combo item.
   */
  sort_order?: number

  /**
   * The parent material ID.
   */
  parent_material_id?: string

  /**
   * The child material ID.
   */
  child_material_id?: string

  /**
   * The created at of the combo item.
   */
  created_at: string

  /**
   * The updated at of the combo item.
   */
  updated_at: string
}

/**
 * The filters to apply on the retrieved combo items.
 */
export interface FilterableComboItemProps
  extends BaseFilterable<FilterableComboItemProps> {
  /**
   * The IDs to filter the combo items by.
   */
  id?: string | string[]

  /**
   * Filter combo items by their parent material IDs.
   */
  parent_material_id?: string | string[]

  /**
   * Filter combo items by their child material IDs.
   */
  child_material_id?: string | string[]
}
