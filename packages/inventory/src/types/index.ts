import { DatabaseType } from "typeorm"

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
