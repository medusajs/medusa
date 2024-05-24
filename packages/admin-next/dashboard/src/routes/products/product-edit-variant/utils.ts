import { z } from "zod"
import { ProductEditVariantSchema } from "./components/product-edit-variant-form"

export const normalizeProductVariantFormValues = (
  variant: Partial<z.infer<typeof ProductEditVariantSchema>>
) => {
  const reqData = {
    ...variant,
    sku: variant.sku || undefined,
    ean: variant.ean || undefined,
    upc: variant.upc || undefined,
    barcode: variant.barcode || undefined,
    mid_code: variant.mid_code || undefined,
    hs_code: variant.hs_code || undefined,
    origin_country: variant.origin_country || undefined,
    material: variant.material || undefined,
  }

  return reqData
}
