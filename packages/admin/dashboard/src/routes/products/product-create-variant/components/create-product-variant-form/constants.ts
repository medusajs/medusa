import { z } from "zod"
import * as zod from "zod"
import { optionalInt } from "../../../../../lib/validation"

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

export const CreateVariantDetailsSchema = CreateProductVariantSchema.pick({
  title: true,
  sku: true,
  manage_inventory: true,
  allow_backorder: true,
  inventory_kit: true,
  options: true,
})

export const CreateVariantDetailsFields = Object.keys(
  CreateVariantDetailsSchema.shape
) as (keyof typeof CreateVariantDetailsSchema.shape)[]

export const CreateVariantPriceSchema = CreateProductVariantSchema.pick({
  prices: true,
})

export const CreateVariantPriceFields = Object.keys(
  CreateVariantPriceSchema.shape
) as (keyof typeof CreateVariantPriceSchema.shape)[]
