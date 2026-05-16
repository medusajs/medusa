export const MATERIAL_TYPE = ["finished", "semi", "normal", "box", "virtual"] as const
export type MaterialType = (typeof MATERIAL_TYPE)[number]

export const SALES_TYPE = ["normal", "combo", "gift", "choice", "box", "lucky_bag"] as const
export type SalesType = (typeof SALES_TYPE)[number]

export const SOURCE_TYPE = ["local", "api"] as const
export type SourceType = (typeof SOURCE_TYPE)[number]

export interface CreateBasicMaterialDTO {
  material_code: string
  material_name: string
  spu_code?: string
  material_type?: MaterialType
  category_id?: string
  sn_managed?: boolean
  stock_controlled?: boolean
  tax_rate?: number
  tax_name?: string
  tax_code?: string
  omnichannel?: boolean
  o2o_enabled?: boolean
  color?: string
  size?: string
  source?: SourceType
  org_id?: string
  metadata?: Record<string, unknown>
}

export interface UpdateBasicMaterialDTO extends Partial<CreateBasicMaterialDTO> {}

export interface CreateSalesMaterialDTO {
  shop_id: string
  sales_code: string
  sales_name: string
  sales_type?: SalesType
  basic_material_id?: string
  is_bound?: boolean
  customer_class_id?: string
  org_id?: string
  tax_rate?: number
  tax_name?: string
  tax_code?: string
  source?: SourceType
  status?: "active" | "inactive"
  metadata?: Record<string, unknown>
}

export interface UpdateSalesMaterialDTO extends Partial<CreateSalesMaterialDTO> {}

export interface CreateComboItemDTO {
  parent_material_id: string
  child_material_id: string
  quantity?: number
  is_optional?: boolean
  sort_order?: number
}

export interface UpdateComboItemDTO extends Partial<CreateComboItemDTO> {}
