import { AdjustmentLineDTO, TaxLineDTO } from "@medusajs/types"
import { calculateAdjustmentTotal } from "../adjustment"
import { BigNumber } from "../big-number"
import { MathBN } from "../math"
import { calculateTaxTotal } from "../tax"

interface GetShippingMethodsTotalsContext {
  includeTax?: boolean
}

export interface GetShippingMethodTotalInput {
  id: string
  amount: BigNumber
  is_tax_inclusive?: boolean
  tax_lines?: TaxLineDTO[]
  adjustments?: AdjustmentLineDTO[]
}

export interface GetShippingMethodTotalOutput {
  amount: BigNumber

  subtotal: BigNumber
  total: BigNumber
  discount_total: BigNumber
  original_total: BigNumber
  tax_total: BigNumber
  original_tax_total: BigNumber
}

export function getShippingMethodsTotals(
  shippingMethods: GetShippingMethodTotalInput[],
  context: GetShippingMethodsTotalsContext
) {
  const { includeTax } = context

  const shippingMethodsTotals = {}

  for (const shippingMethod of shippingMethods) {
    shippingMethodsTotals[shippingMethod.id] = getShippingMethodTotals(
      shippingMethod,
      {
        includeTax,
      }
    )
  }

  return shippingMethodsTotals
}

export function getShippingMethodTotals(
  shippingMethod: GetShippingMethodTotalInput,
  context: GetShippingMethodsTotalsContext
) {
  const amount = MathBN.convert(shippingMethod.amount)

  const discountTotal = calculateAdjustmentTotal({
    adjustments: shippingMethod.adjustments || [],
  })

  const taxTotal = MathBN.convert(0)
  const originalTaxTotal = MathBN.convert(0)

  const totals: GetShippingMethodTotalOutput = {
    amount: new BigNumber(amount),
    total: new BigNumber(amount),
    discount_total: new BigNumber(discountTotal),
    original_total: new BigNumber(amount),
    subtotal: new BigNumber(amount),
    tax_total: new BigNumber(taxTotal),
    original_tax_total: new BigNumber(originalTaxTotal),
  }

  const taxLines = shippingMethod.tax_lines || []
  const taxableAmount = MathBN.sub(amount, discountTotal)

  const newTaxTotal = calculateTaxTotal({
    taxLines,
    includesTax: context.includeTax,
    taxableAmount,
  })

  totals.tax_total = new BigNumber(newTaxTotal)
  // TODO: Calculate original tax total by excluding discounts
  totals.original_tax_total = new BigNumber(newTaxTotal)

  const isTaxInclusive = context.includeTax ?? shippingMethod.is_tax_inclusive

  if (isTaxInclusive) {
    const subtotal = MathBN.add(shippingMethod.amount, newTaxTotal)
    totals.subtotal = new BigNumber(subtotal)
  } else {
    const originalTotal = MathBN.add(
      shippingMethod.amount,
      totals.original_tax_total
    )
    const total = MathBN.add(shippingMethod.amount, totals.tax_total)
    totals.original_total = new BigNumber(originalTotal)
    totals.total = new BigNumber(total)
  }

  return totals
}
