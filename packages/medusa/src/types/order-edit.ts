import { OrderEdit } from "../models"

export type AdminOrdersEditsRes = {
  order_edit: OrderEdit
}

export type StoreOrderEditsRes = {
  order_edit: Omit<
    OrderEdit,
    "internal_note" | "created_by" | "confirmed_by" | "canceled_by"
  >
}

export const defaultOrderEditRelations: string[] = [
  "order",
  "order.items",
  "changes",
  "changes.line_item",
  "changes.original_line_item",
]

export const defaultOrderEditFields: (keyof OrderEdit)[] = [
  "id",
  "order",
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
