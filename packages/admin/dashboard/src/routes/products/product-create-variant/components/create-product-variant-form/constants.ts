import { z } from "zod"
import * as zod from "zod"
import { optionalInt } from "../../../../../lib/validation.ts"

export const CreateProductVariantSchema = z.object({
  title: z.string().min(1),
  sku: z.string().optional(),
  manage_inventory: z.boolean().optional(),
  allow_backorder: z.boolean().optional(),
  inventory_kit: z.boolean().optional(),
  options: z.record(z.string()),
  prices: zod
    .record(zod.string(), zod.string().or(zod.number()).optional())
    .optional(),
  inventory: z
    .array(
      z.object({
        inventory_item_id: z.string(),
        required_quantity: optionalInt,
      })
    )
    .optional(),
})
