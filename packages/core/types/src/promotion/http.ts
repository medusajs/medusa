export type AdminGetPromotionRulesRes = {
  id?: string
  attribute: string
  attribute_label: string
  field_type?: string
  operator: string
  operator_label: string
  values: { label?: string; value?: string }[]
  disguised?: boolean
  required?: boolean
}[]
