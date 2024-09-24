import {
  BigNumberInput,
  CartLineItemDTO,
  CreateOrderAdjustmentDTO,
  CreateOrderLineItemTaxLineDTO,
  ProductVariantDTO,
} from "@medusajs/types"

interface Input {
  item?: CartLineItemDTO
  quantity: BigNumberInput
  metadata?: Record<string, any>
  unitPrice: BigNumberInput
  isTaxInclusive?: boolean
  variant: ProductVariantDTO
  taxLines?: CreateOrderLineItemTaxLineDTO[]
  adjustments?: CreateOrderAdjustmentDTO[]
  cartId?: string
}

export function prepareLineItemData(data: Input) {
  const {
    item,
    variant,
    unitPrice,
    isTaxInclusive,
    quantity,
    metadata,
    cartId,
    taxLines,
    adjustments,
  } = data

  if (!variant.product) {
    throw new Error("Variant does not have a product")
  }

  const lineItem: any = {
    quantity,
    title: variant.title ?? item?.title,
    subtitle: variant.product.title ?? item?.subtitle,
    thumbnail: variant.product.thumbnail ?? item?.thumbnail,

    product_id: variant.product.id ?? item?.product_id,
    product_title: variant.product.title ?? item?.product_title,
    product_description:
      variant.product.description ?? item?.product_description,
    product_subtitle: variant.product.subtitle ?? item?.product_subtitle,
    product_type: variant.product.type?.value ?? item?.product_type ?? null,
    product_collection:
      variant.product.collection?.title ?? item?.product_collection ?? null,
    product_handle: variant.product.handle ?? item?.product_handle,

    variant_id: variant.id,
    variant_sku: variant.sku ?? item?.variant_sku,
    variant_barcode: variant.barcode ?? item?.variant_barcode,
    variant_title: variant.title ?? item?.variant_title,
    variant_option_values: item?.variant_option_values,

    is_discountable: variant.product.discountable ?? item?.is_discountable,
    requires_shipping: variant.requires_shipping ?? item?.requires_shipping,

    unit_price: unitPrice,
    is_tax_inclusive: !!isTaxInclusive,
    metadata,
  }

  if (taxLines) {
    lineItem.tax_lines = prepareTaxLinesData(taxLines)
  }

  if (adjustments) {
    lineItem.adjustments = prepareAdjustmentsData(adjustments)
  }

  if (cartId) {
    lineItem.cart_id = cartId
  }

  return lineItem
}

export function prepareTaxLinesData(data: CreateOrderLineItemTaxLineDTO[]) {
  return data.map((d) => ({
    description: d.description,
    tax_rate_id: d.tax_rate_id,
    code: d.code,
    rate: d.rate,
    provider_id: d.provider_id,
  }))
}

export function prepareAdjustmentsData(data: CreateOrderAdjustmentDTO[]) {
  return data.map((d) => ({
    code: d.code,
    amount: d.amount,
    description: d.description,
    promotion_id: d.promotion_id,
    provider_id: d.promotion_id,
  }))
}
