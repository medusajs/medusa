import * as z from "zod"
import { priceListDetailsSchema } from "./schema"

export type PriceListDetailsSchema = z.infer<typeof priceListDetailsSchema>

/**
 * Re-implementation of enum from `@medusajs/medusa` as it cannot be imported
 */
export enum PriceListStatus {
  ACTIVE = "active",
  DRAFT = "draft",
}

/**
 * Re-implementation of enum from `@medusajs/medusa` as it cannot be imported
 */
export enum PriceListType {
  SALE = "sale",
  OVERRIDE = "override",
}
