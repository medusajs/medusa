import { OrderEdit } from "../models"

export const defaultOrderEditRelations: string[] = [
  "changes",
  "changes.line_item",
  "changes.original_line_item",
]

export const defaultOrderEditFields: (keyof OrderEdit)[] = [
  "id",
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
