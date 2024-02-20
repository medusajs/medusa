import { ProductVariantDTO } from "@medusajs/types"

interface Input {
  quantity: number
  metadata?: Record<string, any>
  variantPrice: number
  variant: ProductVariantDTO
}

export function prepareLineItemData(data: Input) {
  const { variant, variantPrice, quantity, metadata } = data
  return {
    quantity,
    title: variant.title,

    subtitle: variant.product.title,
    thumbnail: variant.product.thumbnail,

    product_id: variant.product.id,
    product_title: variant.product.title,
    product_description: variant.product.description,
    product_subtitle: variant.product.subtitle,
    product_type: variant.product.type?.[0].value ?? null,
    product_collection: variant.product.collection?.[0].value ?? null,
    product_handle: variant.product.handle,

    variant_id: variant.id,
    variant_sku: variant.sku,
    variant_barcode: variant.barcode,
    variant_title: variant.title,

    unit_price: variantPrice,
    metadata,
  }
}
