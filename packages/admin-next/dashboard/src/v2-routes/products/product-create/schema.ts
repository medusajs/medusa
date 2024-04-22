import { CreateProductDTO, CreateProductVariantDTO } from "@medusajs/types"
import * as zod from "zod"

export const CreateProductSchema = zod.object({
  title: zod.string(),
  subtitle: zod.string().optional(),
  handle: zod.string().optional(),
  description: zod.string().optional(),
  discountable: zod.boolean(),
  type_id: zod.string().optional(),
  collection_id: zod.string().optional(),
  category_ids: zod.array(zod.string()).optional(),
  tags: zod.array(zod.string()).optional(),
  sales_channels: zod.array(zod.string()).optional(),
  origin_country: zod.string().optional(),
  material: zod.string().optional(),
  width: zod.string().optional(),
  length: zod.string().optional(),
  height: zod.string().optional(),
  weight: zod.string().optional(),
  mid_code: zod.string().optional(),
  hs_code: zod.string().optional(),
  options: zod.array(
    zod.object({
      title: zod.string(),
      values: zod.array(zod.string()),
    })
  ),
  variants: zod.array(
    zod.object({
      should_create: zod.boolean(),
      title: zod.string(),
      options: zod.record(zod.string(), zod.string()),
      variant_rank: zod.number(),
      prices: zod.record(zod.string(), zod.string()).optional(),
    })
  ),
  images: zod.array(zod.string()).optional(),
  thumbnail: zod.string().optional(),
})

export const defaults: Partial<zod.infer<typeof CreateProductSchema>> = {
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
  category_ids: [],
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

export const normalize = (
  values: CreateProductSchemaType & { status: CreateProductDTO["status"] }
) => {
  const reqData = {
    ...values,
    is_giftcard: false,
    tags: values.tags?.map((tag) => ({ value: tag })),
    sales_channels: values.sales_channels?.map((sc) => ({ id: sc })),
    width: values.width ? parseFloat(values.width) : undefined,
    length: values.length ? parseFloat(values.length) : undefined,
    height: values.height ? parseFloat(values.height) : undefined,
    weight: values.weight ? parseFloat(values.weight) : undefined,
    variants: normalizeVariants(values.variants as any),
  } as any

  return reqData
}

export const normalizeVariants = (
  variants: (Partial<CreateProductVariantDTO> & {
    prices?: Record<string, string>
  })[]
) => {
  return variants.map((variant) => ({
    ...variant,
    prices: Object.entries(variant.prices || {}).map(([key, value]: any) => ({
      currency_code: key,
      amount: value ? parseFloat(value) : 0,
    })),
  }))
}

export type CreateProductSchemaType = zod.infer<typeof CreateProductSchema>
