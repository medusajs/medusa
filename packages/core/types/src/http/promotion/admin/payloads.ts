import { AdminCreateCampaign } from "../../campaign"

export type AdminCreatePromotionRule = {
  operator: "gte" | "lte" | "gt" | "lt" | "eq" | "ne" | "in"
  description: string | null
  attribute: string
  value: string | string[]
}

export type AdminCreateApplication = {
  description: string | null
  value: number
  currency_code: string | null
  max_quantity: number | null
  type: "fixed" | "percentage"
  target_type: "order" | "shipping_methods" | "items"
  allocation?: "each" | "across"
  target_rules?: AdminCreatePromotionRule[]
  buy_rules?: AdminCreatePromotionRule[]
  apply_to_quantity: number | null
  buy_rules_min_quantity: number | null
}

export type AdminCreatePromotion = {
  code: string
  is_automatic?: boolean
  type: "standard" | "buyget"
  campaign_id: string | null
  campaign?: AdminCreateCampaign
  application_method: AdminCreateApplication
  rules?: AdminCreatePromotionRule[]
}