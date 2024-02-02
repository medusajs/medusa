export type ComputeActions =
  | AddItemAdjustmentAction
  | RemoveItemAdjustmentAction
  | AddShippingMethodAdjustment
  | RemoveShippingMethodAdjustment
  | CampaignBudgetExceededAction

export type UsageComputedActions =
  | AddShippingMethodAdjustment
  | AddItemAdjustmentAction

export interface CampaignBudgetExceededAction {
  action: "campaignBudgetExceeded"
  code: string
}

export interface AddItemAdjustmentAction {
  action: "addItemAdjustment"
  item_id: string
  amount: number
  code: string
  description?: string
}

export interface RemoveItemAdjustmentAction {
  action: "removeItemAdjustment"
  adjustment_id: string
  description?: string
  code: string
}

export interface AddShippingMethodAdjustment {
  action: "addShippingMethodAdjustment"
  shipping_method_id: string
  amount: number
  code: string
  description?: string
}

export interface RemoveShippingMethodAdjustment {
  action: "removeShippingMethodAdjustment"
  adjustment_id: string
  code: string
}

export interface ComputeActionAdjustmentLine extends Record<string, unknown> {
  id: string
  code: string
}

export interface ComputeActionItemLine extends Record<string, unknown> {
  id: string
  quantity: number
  subtotal: number
  adjustments?: ComputeActionAdjustmentLine[]
}

export interface ComputeActionShippingLine extends Record<string, unknown> {
  id: string
  subtotal: number
  adjustments?: ComputeActionAdjustmentLine[]
}

export interface ComputeActionContext extends Record<string, unknown> {
  items?: ComputeActionItemLine[]
  shipping_methods?: ComputeActionShippingLine[]
}

export interface ComputeActionOptions {
  prevent_auto_promotions?: boolean
}
