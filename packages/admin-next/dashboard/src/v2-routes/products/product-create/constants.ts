import { z } from "zod"
import {
  CreateProductOptionSchema,
  CreateVariantSchema,
} from "../common/schemas"

export const ProductCreateVariantSchema = CreateVariantSchema.extend({
  should_create: z.boolean(),
  allow_backorder: z.enum(["true", "false"]).optional(),
  manage_inventory: z.enum(["true", "false"]).optional(),
})

export const ProductCreateSchema = z.object({
  title: z.string(),
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
  options: z.array(CreateProductOptionSchema),
  variants: z.array(ProductCreateVariantSchema),
  images: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
})

export const PRODUCT_CREATE_FORM_DEFAULTS: Partial<
  z.infer<typeof ProductCreateSchema>
> = {
  discountable: true,
  tags: [],
  sales_channels: [],
  options: [
    {
      title: "",
      values: [],
    },
  ],
  variants: [],
  images: [],
  thumbnail: "",
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
