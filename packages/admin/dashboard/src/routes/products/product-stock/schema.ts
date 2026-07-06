import { z } from "zod"

const LocationQuantitySchema = z.object({
  id: z.string().optional(),
  quantity: z.union([z.number(), z.string()]),
  checked: z.boolean(),
  disabledToggle: z.boolean(),
})

const ProductStockLocationsSchema = z.record(z.string(), LocationQuantitySchema)

const ProductStockInventoryItemSchema = z.object({
  locations: ProductStockLocationsSchema,
})

const ProductStockVariantSchema = z.object({
  inventory_items: z.record(z.string(), ProductStockInventoryItemSchema),
})

export const ProductStockSchema = z.object({
  variants: z.record(z.string(), ProductStockVariantSchema),
})

export type ProductStockLocationSchema = z.infer<
  typeof ProductStockLocationsSchema
>
export type ProductStockInventoryItemSchema = z.infer<
  typeof ProductStockInventoryItemSchema
>
export type ProductStockVariantSchema = z.infer<
  typeof ProductStockVariantSchema
>
export type ProductStockSchema = z.infer<typeof ProductStockSchema>
