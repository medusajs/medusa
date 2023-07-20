import { DatabaseType } from "typeorm"
import { InventoryLevel } from "../models"

export type InventoryServiceInitializeOptions = {
  database?: {
    type?: DatabaseType | string
    url?: string
    database?: string
    extra?: Record<string, any>
    schema?: string
    logging?: boolean
  }
}

export type UpdateInventoryLevelInput = Omit<
  Partial<InventoryLevel>,
  "id" | "created_at" | "metadata" | "deleted_at"
>
