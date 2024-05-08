import { z } from "zod"
import { optionalInt } from "../../../lib/validation"

export const CreateVariantSchema = z.object({
  title: z.string().min(1),
  sku: z.string().optional(),
  ean: z.string().optional(),
  upc: z.string().optional(),
  barcode: z.string().optional(),
  hs_code: z.string().optional(),
  mid_code: z.string().optional(),
  inventory_quantity: optionalInt,
  allow_backorder: z.boolean().optional(),
  manage_inventory: z.boolean().optional(),
  variant_rank: z.number().optional(),
  weight: optionalInt,
  length: optionalInt,
  height: optionalInt,
  width: optionalInt,
  origin_country: z.string().optional(),
  material: z.string().optional(),
  prices: z.record(z.string(), optionalInt),
  options: z.record(z.string(), z.string()),
})

export const UpdateVariantSchema = CreateVariantSchema.extend({
  id: z.string(),
  sku: z.string().nullable().optional(),
  ean: z.string().nullable().optional(),
  upc: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  hs_code: z.string().nullable().optional(),
  mid_code: z.string().nullable().optional(),
  weight: z.number().nullable().optional(),
  length: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  width: z.number().nullable().optional(),
  origin_country: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
})

export const CreateProductOptionSchema = z.object({
  title: z.string(),
  values: z.array(z.string()),
})
