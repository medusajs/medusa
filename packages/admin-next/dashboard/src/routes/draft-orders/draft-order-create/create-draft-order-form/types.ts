import { z } from "zod"
import {
  CustomItemSchema,
  ExistingItemSchema,
  ShippingMethodSchema,
} from "./constants"

export type ExistingItem = z.infer<typeof ExistingItemSchema>
export type CustomItem = z.infer<typeof CustomItemSchema>
export type ShippingMethod = z.infer<typeof ShippingMethodSchema>
