import { ProductTypes } from "@medusajs/types"
import faker from "faker"

export const buildProductVariantOnlyData = ({
  title,
  sku,
  barcode,
  ean,
  upc,
  allow_backorder,
  manage_inventory,
  hs_code,
  origin_country,
  mid_code,
  material,
  weight,
  length,
  height,
  width,
  options,
  metadata,
}: Partial<ProductTypes.CreateProductVariantOnlyDTO>) => {
  return {
    title: title ?? faker.commerce.productName(),
    sku: sku ?? faker.commerce.productName(),
    barcode,
    ean,
    upc,
    allow_backorder,
    manage_inventory,
    hs_code,
    origin_country,
    mid_code,
    material,
    weight,
    length,
    height,
    width,
    options,
    metadata,
  }
}
