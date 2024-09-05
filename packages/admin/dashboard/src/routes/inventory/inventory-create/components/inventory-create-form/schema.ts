import { z } from "zod"
import { optionalInt } from "../../../../../lib/validation"

export const CreateInventoryItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  sku: z.string().optional(),
  hs_code: z.string().optional(),
  weight: optionalInt,
  length: optionalInt,
  height: optionalInt,
  width: optionalInt,
  origin_country: z.string().optional(),
  mid_code: z.string().optional(),
  material: z.string().optional(),
  requires_shipping: z.boolean().optional(),
  thumbnail: z.string().optional(),
  locations: z.record(z.string(), optionalInt).optional(),
})

export type CreateInventoryItemSchema = z.infer<
  typeof CreateInventoryItemSchema
>
