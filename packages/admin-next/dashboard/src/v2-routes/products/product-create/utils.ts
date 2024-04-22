import { CreateProductDTO, CreateProductVariantDTO } from "@medusajs/types"
import { ProductCreateSchemaType } from "./types"

export const normalizeProductFormValues = (
  values: ProductCreateSchemaType & { status: CreateProductDTO["status"] }
) => {
  const reqData = {
    ...values,
    is_giftcard: false,
    tags: values.tags?.map((tag) => ({ value: tag })),
    sales_channels: values.sales_channels?.map((sc) => ({ id: sc.id })),
    width: values.width ? parseFloat(values.width) : undefined,
    length: values.length ? parseFloat(values.length) : undefined,
    height: values.height ? parseFloat(values.height) : undefined,
    weight: values.weight ? parseFloat(values.weight) : undefined,
    variants: normalizeVariants(values.variants),
  }

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
