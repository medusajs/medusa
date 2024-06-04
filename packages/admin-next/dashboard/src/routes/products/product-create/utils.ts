import { CreateProductDTO } from "@medusajs/types"
import { ProductCreateSchemaType } from "./types"
import { getDbAmount } from "../../../lib/money-amount-helpers.ts"
import { castNumber } from "../../../lib/cast-number.ts"

export const normalizeProductFormValues = (
  values: ProductCreateSchemaType & { status: CreateProductDTO["status"] }
) => {
  const thumbnail = values.media?.find((media) => media.isThumbnail)?.url
  const images = values.media
    ?.filter((media) => !media.isThumbnail)
    .map((media) => ({ url: media.url }))

  return {
    status: values.status,
    is_giftcard: false,
    tags: values?.tags?.length
      ? values.tags?.map((tag) => ({ value: tag }))
      : undefined,
    sales_channels: values?.sales_channels?.length
      ? values.sales_channels?.map((sc) => ({ id: sc.id }))
      : undefined,
    images,
    collection_id: values.collection_id || undefined,
    categories: values.categories.map((id) => ({ id })),
    type_id: values.type_id || undefined,
    handle: values.handle || undefined,
    origin_country: values.origin_country || undefined,
    material: values.material || undefined,
    mid_code: values.mid_code || undefined,
    hs_code: values.hs_code || undefined,
    thumbnail,
    title: values.title,
    subtitle: values.subtitle || undefined,
    description: values.description || undefined,
    discountable: values.discountable || undefined,
    width: values.width ? parseFloat(values.width) : undefined,
    length: values.length ? parseFloat(values.length) : undefined,
    height: values.height ? parseFloat(values.height) : undefined,
    weight: values.weight ? parseFloat(values.weight) : undefined,
    options: values.options.filter((o) => o.title), // clean temp. values
    variants: normalizeVariants(
      values.variants.filter((variant) => variant.should_create)
    ),
  }
}

export const normalizeVariants = (
  variants: ProductCreateSchemaType["variants"]
) => {
  return variants.map((variant) => ({
    title:
      variant.custom_title || Object.values(variant.options || {}).join(" / "),
    options: variant.options,
    sku: variant.sku || undefined,
    manage_inventory: variant.manage_inventory || undefined,
    allow_backorder: variant.allow_backorder || undefined,
    // TODO: inventory - should be added to the workflow
    prices: Object.entries(variant.prices || {}).map(([key, value]: any) => ({
      currency_code: key,
      amount: getDbAmount(castNumber(value), key),
    })),
  }))
}

export const decorateVariantsWithDefaultValues = (
  variants: ProductCreateSchemaType["variants"]
) => {
  return variants.map((variant) => ({
    ...variant,
    title: variant.title || "",
    sku: variant.sku || "",
    ean: variant.ean || "",
    upc: variant.upc || "",
    barcode: variant.barcode || "",
    manage_inventory: variant.manage_inventory || false,
    allow_backorder: variant.allow_backorder || false,
    inventory_kit: variant.inventory_kit || false,
    mid_code: variant.mid_code || "",
    hs_code: variant.hs_code || "",
    width: variant.width || "",
    height: variant.height || "",
    weight: variant.weight || "",
    length: variant.length || "",
    material: variant.material || "",
    origin_country: variant.origin_country || "",
  }))
}
