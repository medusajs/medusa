import { z } from "@medusajs/deps/zod"
import { ProductStatus } from "./enums"

export const booleanString = () =>
  z
    .union([z.boolean(), z.string()])
    .refine((value) => {
      return ["true", "false"].includes(value.toString().toLowerCase())
    })
    .transform((value) => {
      return value.toString().toLowerCase() === "true"
    })

export const numericString = () =>
  z.number().transform((value) => {
    return value !== null && value !== undefined ? String(value) : value
  })

export const IdAssociation = z.object({
  id: z.string(),
})

const statusEnum = z.nativeEnum(ProductStatus)

export const CreateVariantPrice = z.object({
  currency_code: z.string(),
  amount: z.number(),
  min_quantity: z.number().nullish(),
  max_quantity: z.number().nullish(),
  rules: z.record(z.string(), z.string()).optional(),
})

export const CreateProductOption = z.object({
  title: z.string(),
  values: z.array(z.string()),
})

export const CreateProductVariant = z
  .object({
    title: z.string(),
    sku: z.string().nullish(),
    ean: z.string().nullish(),
    upc: z.string().nullish(),
    barcode: z.string().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    allow_backorder: booleanString().optional().default(false),
    manage_inventory: booleanString().optional().default(true),
    variant_rank: z.number().optional(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
    prices: z.array(CreateVariantPrice),
    options: z.record(z.string()).optional(),
    inventory_items: z
      .array(
        z.object({
          inventory_item_id: z.string(),
          required_quantity: z.number(),
        })
      )
      .optional(),
  })
  .strict()

export const CreateProduct = z
  .object({
    title: z.string(),
    subtitle: z.string().nullish(),
    description: z.string().nullish(),
    is_giftcard: booleanString().optional().default(false),
    discountable: booleanString().optional().default(true),
    images: z.array(z.object({ url: z.string() })).optional(),
    thumbnail: z.string().nullish(),
    handle: z.string().optional(),
    status: statusEnum.optional().default(ProductStatus.DRAFT),
    external_id: z.string().nullish(),
    type_id: z.string().nullish(),
    collection_id: z.string().nullish(),
    categories: z.array(IdAssociation).optional(),
    tags: z.array(IdAssociation).optional(),
    options: z.array(CreateProductOption).optional(),
    variants: z.array(CreateProductVariant).optional(),
    sales_channels: z.array(z.object({ id: z.string() })).optional(),
    shipping_profile_id: z.string().optional(),
    weight: z.number().nullish(),
    length: z.number().nullish(),
    height: z.number().nullish(),
    width: z.number().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()

export const UpdateProductOption = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  values: z.array(z.string()).optional(),
})

export const UpdateVariantPrice = z.object({
  id: z.string().optional(),
  currency_code: z.string().optional(),
  amount: z.number().optional(),
  min_quantity: z.number().nullish(),
  max_quantity: z.number().nullish(),
  rules: z.record(z.string(), z.string()).optional(),
})

export const UpdateProductVariant = z
  .object({
    id: z.string().optional(),
    title: z.string().optional(),
    prices: z.array(UpdateVariantPrice).optional(),
    sku: z.string().nullish(),
    ean: z.string().nullish(),
    upc: z.string().nullish(),
    barcode: z.string().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    allow_backorder: booleanString().optional(),
    manage_inventory: booleanString().optional(),
    variant_rank: z.number().optional(),
    weight: numericString().nullish(),
    length: numericString().nullish(),
    height: numericString().nullish(),
    width: numericString().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
    options: z.record(z.string()).optional(),
  })
  .strict()

export const UpdateProduct = z
  .object({
    id: z.string(),
    title: z.string().optional(),
    discountable: booleanString().optional(),
    is_giftcard: booleanString().optional(),
    options: z.array(UpdateProductOption).optional(),
    variants: z.array(UpdateProductVariant).optional(),
    status: statusEnum.optional(),
    subtitle: z.string().nullish(),
    description: z.string().nullish(),
    images: z.array(z.object({ url: z.string() })).optional(),
    thumbnail: z.string().nullish(),
    handle: z.string().nullish(),
    type_id: z.string().nullish(),
    external_id: z.string().nullish(),
    collection_id: z.string().nullish(),
    categories: z.array(IdAssociation).optional(),
    tags: z.array(IdAssociation).optional(),
    sales_channels: z.array(z.object({ id: z.string() })).optional(),
    shipping_profile_id: z.string().nullish(),
    weight: numericString().nullish(),
    length: numericString().nullish(),
    height: numericString().nullish(),
    width: numericString().nullish(),
    hs_code: z.string().nullish(),
    mid_code: z.string().nullish(),
    origin_country: z.string().nullish(),
    material: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()
