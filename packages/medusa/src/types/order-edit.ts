import { OrderEdit } from "../models"

export type UpdateOrderEditInput = {
  internal_note?: string
}

export type CreateOrderEditInput = {
  order_id: string
  internal_note?: string
}

export const defaultOrderEditRelations: string[] = [
  "changes",
  "changes.line_item",
  "changes.original_line_item",
  "items",
  "items.tax_lines",
]

export const defaultOrderEditFields: (keyof OrderEdit)[] = [
  "id",
  "items",
  "changes",
  "order_id",
  "created_by",
  "requested_by",
  "requested_at",
  "confirmed_by",
  "confirmed_at",
  "declined_by",
  "declined_reason",
  "declined_at",
  "canceled_by",
  "canceled_at",
  "internal_note",
]

export const storeOrderEditNotAllowedFields = [
  "internal_note",
  "created_by",
  "confirmed_by",
  "canceled_by",
]

export const defaultStoreOrderEditRelations = defaultOrderEditRelations.filter(
  (field) => !storeOrderEditNotAllowedFields.includes(field)
)
export const defaultStoreOrderEditFields = defaultOrderEditFields.filter(
  (field) => !storeOrderEditNotAllowedFields.includes(field)
)
