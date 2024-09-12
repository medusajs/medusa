import { z } from "zod"

export const CreateProductVariantSchema = z.object({
  title: z.string().min(1),
  sku: z.string().optional(),
  manage_inventory: z.boolean(),
  allow_backorder: z.boolean(),
  options: z.record(z.string()),
})
