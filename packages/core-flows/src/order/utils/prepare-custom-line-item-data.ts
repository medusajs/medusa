import { BigNumberInput } from "@medusajs/types"

interface Input {
  quantity: BigNumberInput
  metadata?: Record<string, any>
  unitPrice: BigNumberInput
  variant: {
    title: string
    sku?: string
    barcode?: string
  }
}

interface Output {
  quantity: BigNumberInput
  title: string
  variant_sku?: string
  variant_barcode?: string
  variant_title?: string
  unit_price: BigNumberInput
  metadata?: Record<string, any>
}

export function prepareCustomLineItemData(data: Input): Output {
  const { variant, unitPrice, quantity, metadata } = data

  const lineItem: any = {
    quantity,
    title: variant.title,
    variant_sku: variant.sku,
    variant_barcode: variant.barcode,
    variant_title: variant.title,

    unit_price: unitPrice,
    metadata,
  }

  return lineItem
}
