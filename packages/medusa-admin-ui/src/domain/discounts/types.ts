export type DiscountFormType = {
  code: string
  usage_limit: string
  rule: {
    value: string
    description: string
  }
}

export enum DiscountConditionType {
  PRODUCTS = "products",
  PRODUCT_TYPES = "product_types",
  PRODUCT_COLLECTIONS = "product_collections",
  PRODUCT_TAGS = "product_tags",
  CUSTOMER_GROUPS = "customer_groups",
}

export type ConditionPayload = {
  id?: string
  items?: { id: string; label: string }[]
}

export type DiscountConditionRecord = {
  products: ConditionPayload | null
  product_types: ConditionPayload | null
  product_collections: ConditionPayload | null
  product_tags: ConditionPayload | null
  customer_groups: ConditionPayload | null
}

export enum DiscountConditionOperator {
  IN = "in",
  NOT_IN = "not_in",
}

export type CreateConditionProps = {
  type: DiscountConditionType
  ids: string[]
}

export type CondtionMapItem = {
  id?: string
  operator: DiscountConditionOperator
  type: DiscountConditionType
  items: { id: string; label: string }[]
  shouldDelete?: boolean
}

export type ConditionMap = {
  products: CondtionMapItem
  product_collections: CondtionMapItem
  product_tags: CondtionMapItem
  customer_groups: CondtionMapItem
  product_types: CondtionMapItem
}

export enum AllocationType {
  ITEM = "item",
  TOTAL = "total",
}

export enum DiscountRuleType {
  FIXED = "fixed",
  PERCENTAGE = "percentage",
  FREE_SHIPPING = "free_shipping",
}

export type UpdateConditionProps = {
  type:
    | "products"
    | "product_collections"
    | "product_types"
    | "product_tags"
    | "customer_groups"
  items: { id: string; label: string }[] | null
  operator: DiscountConditionOperator
}

export type AddConditionSelectorProps = {
  onClose: () => void
}
