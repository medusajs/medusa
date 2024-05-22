import { CreateProductDTO } from "@medusajs/types"
import { ProductCreateSchemaType } from "./types"
import { z } from "zod"

export const normalizeProductFormValues = (
  values: ProductCreateSchemaType & { status: CreateProductDTO["status"] }
) => {
  const reqData = {
    ...values,
    is_giftcard: false,
    tags: values?.tags?.length
      ? values.tags?.map((tag) => ({ value: tag }))
      : undefined,
    sales_channels: values?.sales_channels?.length
      ? values.sales_channels?.map((sc) => ({ id: sc.id }))
      : undefined,
    images: values.images?.length ? values.images : undefined,
    collection_id: values.collection_id || undefined,
    categories: values.categories.map((id) => ({ id })),
    type_id: values.type_id || undefined,
    handle: values.handle || undefined,
    origin_country: values.origin_country || undefined,
    material: values.material || undefined,
    mid_code: values.mid_code || undefined,
    hs_code: values.hs_code || undefined,
    thumbnail: values.thumbnail || undefined,
    subtitle: values.subtitle || undefined,
    description: values.description || undefined,
    width: values.width ? parseFloat(values.width) : undefined,
    length: values.length ? parseFloat(values.length) : undefined,
    height: values.height ? parseFloat(values.height) : undefined,
    weight: values.weight ? parseFloat(values.weight) : undefined,
    variants: normalizeVariants(values.variants),
  }

  return reqData
}

export const normalizeVariants = (
  variants: ProductCreateSchemaType["variants"]
) => {
  return variants
    .filter((variant) => variant.should_create)
    .map((variant) => ({
      title:
        variant.custom_title ||
        Object.values(variant.options || {}).join(" / "),
      options: variant.options,
      sku: variant.sku,
      manage_inventory: variant.manage_inventory,
      allow_backorder: variant.allow_backorder,
      prices: Object.entries(variant.prices || {}).map(([key, value]: any) => ({
        currency_code: key,
        amount: value ? parseFloat(value) : 0,
      })),
    }))
}
