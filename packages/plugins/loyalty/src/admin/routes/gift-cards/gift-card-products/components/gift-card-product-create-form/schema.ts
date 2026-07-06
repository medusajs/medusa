import { z } from "zod";
import { optionalFloat, optionalInt } from "../../../../../utils/validations";

export const SC_STACKED_MODAL_ID = "sc";

export const MediaSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  isThumbnail: z.boolean(),
  file: z.any().nullable(), // File
});

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
  manage_inventory: z.boolean().optional(),
  allow_backorder: z.boolean().optional(),
  inventory_kit: z.boolean().optional(),
  options: z.record(z.string(), z.string()),
  variant_rank: z.number(),
  prices: z.record(z.string(), optionalFloat).optional(),
  inventory: z
    .array(
      z.object({
        inventory_item_id: z.string(),
        required_quantity: optionalInt,
      })
    )
    .optional(),
});

export type ProductCreateVariantSchema = z.infer<
  typeof ProductCreateVariantSchema
>;

const ProductCreateOptionSchema = z.object({
  title: z.string(),
  values: z.array(z.string()).min(1),
});

export type ProductCreateOptionSchema = z.infer<
  typeof ProductCreateOptionSchema
>;

export const ProductCreateSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  handle: z.string().optional(),
  description: z.string().optional(),
  discountable: z.boolean(),
  type_id: z.string().optional(),
  collection_id: z.string().optional(),
  shipping_profile_id: z.string().optional(),
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
  denominations: z
    .array(
      z.object({
        value: z.string().min(1),
        prices: z.record(z.string(), optionalFloat).optional(),
      })
    )
    .min(1),
  enable_variants: z.boolean(),
  media: z.array(MediaSchema).optional(),
});

export const EditProductMediaSchema = z.object({
  media: z.array(MediaSchema),
});

export const PRODUCT_CREATE_FORM_DEFAULTS: Partial<
  z.infer<typeof ProductCreateSchema>
> = {
  discountable: true,
  tags: [],
  sales_channels: [],
  denominations: [
    {
      value: "100",
      prices: {},
    },
  ],
  enable_variants: true,
  media: [],
  categories: [],
  collection_id: "",
  shipping_profile_id: "",
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
};
