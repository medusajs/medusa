export type MaterialType = "finished" | "semi" | "normal" | "box" | "virtual"
export type SalesType = "normal" | "combo" | "gift" | "choice" | "box" | "lucky_bag"
export type SourceType = "local" | "api"

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
  material_id?: string
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
