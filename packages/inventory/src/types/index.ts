import { DatabaseType, EntityManager } from "typeorm"
import { Context } from "@medusajs/types"
import { MessageAggregator } from "@medusajs/utils"

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

export type InternalContext = Context<EntityManager> & {
  messageAggregator?: MessageAggregator
}

export * from "./events"
