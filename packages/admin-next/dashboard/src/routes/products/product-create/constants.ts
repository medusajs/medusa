import { z } from "zod"
import { optionalInt } from "../../../lib/validation.ts"
import { decorateVariantsWithDefaultValues } from "./utils.ts"

export const MediaSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  isThumbnail: z.boolean(),
  file: z.any().nullable(), // File
})

const ProductCreateVariantSchema = z.object({
  should_create: z.boolean(),
  is_default: z.boolean().optional(),
  title: z.string(),
  upc: z.string().optional(),
  ean: z.string().optional(),
  barcode: z.string().optional(),
  mid_code: z.string().optional(),
  hs_code: z.string().optional(),
  width: optionalInt,
  height: optionalInt,
  length: optionalInt,
  weight: optionalInt,
  material: z.string().optional(),
  origin_country: z.string().optional(),
  custom_title: z.string().optional(),
  sku: z.string().optional(),
  manage_inventory: z.boolean().optional(),
  allow_backorder: z.boolean().optional(),
  inventory_kit: z.boolean().optional(),
  options: z.record(z.string(), z.string()),
  variant_rank: z.number(),
  prices: z.record(z.string(), z.string().optional()).optional(),
  inventory: z
    .array(
      z.object({
        inventory_item_id: z.string(),
        required_quantity: optionalInt,
      })
    )
    .optional(),
})

export type ProductCreateVariantSchema = z.infer<
  typeof ProductCreateVariantSchema
>

const ProductCreateOptionSchema = z.object({
  title: z.string(),
  values: z.array(z.string()).min(1),
})

export type ProductCreateOptionSchema = z.infer<
  typeof ProductCreateOptionSchema
>

export const ProductCreateSchema = z
  .object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    handle: z.string().optional(),
    description: z.string().optional(),
    discountable: z.boolean(),
    type_id: z.string().optional(),
    collection_id: z.string().optional(),
    categories: z.array(z.string()),
    tags: z.array(z.string()).optional(),
    sales_channels: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      )
      .optional(),
    origin_country: z.string().optional(),
    material: z.string().optional(),
    width: z.string().optional(),
    length: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    mid_code: z.string().optional(),
    hs_code: z.string().optional(),
    options: z.array(ProductCreateOptionSchema).min(1),
    enable_variants: z.boolean(),
    variants: z.array(ProductCreateVariantSchema).min(1),
    media: z.array(MediaSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.variants.every((v) => !v.should_create)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants"],
        message: "invalid_length",
      })
    }
  })

export const EditProductMediaSchema = z.object({
  media: z.array(MediaSchema),
})

export const PRODUCT_CREATE_FORM_DEFAULTS: Partial<
  z.infer<typeof ProductCreateSchema>
> = {
  discountable: true,
  tags: [],
  sales_channels: [],
  options: [
    {
      title: "Default option",
      values: ["Default option value"],
    },
  ],
  variants: decorateVariantsWithDefaultValues([
    {
      title: "Default variant",
      should_create: true,
      variant_rank: 0,
      options: {
        "Default option": "Default option value",
      },
      inventory: [{ inventory_item_id: "", required_quantity: "" }],
      is_default: true,
    },
  ]),
  enable_variants: false,
  media: [],
  categories: [],
  collection_id: "",
  description: "",
  handle: "",
  height: "",
  hs_code: "",
  length: "",
  material: "",
  mid_code: "",
  origin_country: "",
  subtitle: "",
  title: "",
  type_id: "",
  weight: "",
  width: "",
}
